import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
var exec = require('child_process').exec;
const fs = require('fs-extra');
const replace = require('replace-in-file');
var zipper = require('zip-local');

export default class CreateMetadata extends SfdxCommand {

  public static description = 'Creates and deletes metadata for a specified org';

  protected static flagsConfig = {
	deploymenttimelimit: flags.integer({ char: 'w', description: 'How many minutes to wait for the deployment to finish', default: 200 }),
	batchsize: flags.integer({ char: 'b', description: 'Batch Size', default: 5 }),
    filepath: flags.filepath({char: 'f', description: 'Path to comma seperated fully qualified object API names to which CDC has to be enabled', default: 'inputs.txt'}),
	check: flags.boolean({char: 'c', description: 'Validate and donot deploy'}),
	createxmlfile: flags.boolean({char: 'x', description: 'Create xml files along with the components'}),
	metadatatype: flags.string({char: 'm', description: 'Metadata type',default: 'PlatformEventChannelMember'}),
	isdestructive: flags.boolean({char: 'd', description: 'To delete components'}),
	isscratchorg: flags.boolean({char: 's', description: 'Is Scratch Org?'})
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = false;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<AnyJson> {
	
	
		var supportedMetadataTypes = {'PlatformEventChannelMember': {'singular' : 'platformEventChannelMember',
																	 'plural': 'platformEventChannelMembers'}};
		
		if(!supportedMetadataTypes.hasOwnProperty(this.flags.metadatatype)){
			
			console.error('Metadata type '+this.flags.metadatatype+ ' is not supported.');
			return;
		}
		
		console.log('Process initiated.This may take a while...');
		
		try{
			
			var contents = fs.readFileSync(this.flags.filepath, 'utf8');
			
			if(contents.length < 1){
				
				console.error('Input file is empty');
				return;
			}
				
			
			
			var entries = contents.split(',');
			
			if(contents.length > 0 && entries && entries.length > 0){
						
				fs.removeSync('./tmp');
				
				var jobsPath = './jobs';
				
				if (fs.existsSync(jobsPath)){
					
					fs.removeSync(jobsPath);
				}

				fs.mkdirSync(jobsPath);
				
				
				var metadataType = supportedMetadataTypes[this.flags.metadatatype];
				var templatePath = './templates/'+metadataType.singular+'/template.'+metadataType.singular;
				
				var perChunk =  this.flags.batchsize;

				var result = entries.reduce((resultArray, item, index) => { 
				  const chunkIndex = Math.floor(index/perChunk)

				  if(!resultArray[chunkIndex]) {
					resultArray[chunkIndex] = [] // start a new chunk
				  }

				  resultArray[chunkIndex].push(item)

				  return resultArray
				}, [])
								
				
				for(var i =0;i< result.length;i ++){
					
				  var entries = result[i];
				  var unpackagedDirectory = 'unpackaged' + i;
				  var memberBody = '';
				  
				  for(var j =0;j < entries.length;j ++){
						
						var entry = entries[j].trim();
						var entrySplit = entry.split('__');
						
						if(this.flags.isscratchorg && entrySplit.length > 2){
							
							entry = entry.replace(entrySplit[0]+'__', '');
						}
						
						var fileName = entry.includes('__c') ? entry.replace('__c', '_ChangeEvent') : entry + 'ChangeEvent';
						fileName = fileName.replace('__', '_');
						fileName = 'ChangeEvents_'+ fileName;
						memberBody += '<members>' + fileName + '</members>\n';
						
						var xmlEntry = entry.includes('__c') ? entry.replace('__c', '__ChangeEvent') : entry + 'ChangeEvent';
						
						var destinationPath = './tmp/'+ unpackagedDirectory +'/'+metadataType.plural+'/'+fileName+'.'+metadataType.singular;
						
						var files = [destinationPath];
						if(this.flags.createxmlfile)
							files.push(destinationPath+'-meta.xml');
						
						var options = {
							  files: files,
							  from: /{!NAME}/g,
							  to: xmlEntry,
							};
							
							
						fs.copySync(templatePath,destinationPath);
						
						if(this.flags.createxmlfile)
							fs.copySync(templatePath,destinationPath+'-meta.xml');
						
						replace.sync(options);
					}
					
					var xmlFilePath = './tmp/'+ unpackagedDirectory +'/'+( this.flags.isdestructive ? 'destructiveChanges.xml' : 'package.xml');
					fs.copySync('./templates/'+metadataType.singular+'/package.xml',xmlFilePath);
					
					var options = {
					  files: xmlFilePath,
					  from: /{!BODY}/g,
					  to: memberBody,
					};
					
					replace.sync(options);
					
					if(this.flags.isdestructive)
						fs.copySync('./templates/destructiveChanges/package.xml','./tmp/'+ unpackagedDirectory +'/package.xml');

					
					
					await exec('sfdx force:mdapi:deploy -d ./tmp/'+ unpackagedDirectory +'/ --json ' + (this.flags.check ? ' -c ' : '') + '-u '+ this.org.getUsername(), (error, stdout, stderr) => {
					  if (error) {
						//console.error(`exec error: ${error}`);
						return;
					  }
					  var job = JSON.parse(stdout);
					  console.log(stdout);
					  
					  zipper.sync.zip('./tmp/'+ unpackagedDirectory).compress().save('./jobs/'+job.result.id+'.zip');
					  
					});
					
					
				}
				
			}

		}
		catch(error){
			console.error(`${error}`);
		}
  }
  
}
