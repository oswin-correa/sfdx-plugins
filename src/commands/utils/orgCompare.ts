import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { exec } from 'child_process';
const fs = require('fs-extra');
const dircompare = require('dir-compare');

export default class orgCompare extends SfdxCommand {

  public static description = 'Compare two salesforce orgs and generates report';

  protected static flagsConfig = {
	org1: flags.string({ char: 'x', description: 'Username of Org1', required: true }),
	org2: flags.string({ char: 'y', description: 'Username of Org2', required: false })
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = false;
 
  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = false;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = true;

  public async run(): Promise<AnyJson> {
	  
	console.log('Process initiated.This may take a while...');  
	fs.emptyDir('./org_compare');
	
	if(fs.existsSync('./force-app/main')){
		
		if(!this.flags.org2){
			
			fs.copySync('./force-app/main', './org_compare/source');
			fs.emptyDir('./force-app/main');
		}
		else{
			
			fs.copySync('./force-app/main', './org_compare/backup');
			fs.emptyDir('./force-app/main');
		}
	}
	
	exec('sfdx force:source:retrieve  -x ./manifest/package.xml -u '+ this.flags.org1 ,{maxBuffer: 1024 * 1024 * 10}, (org1_error, org1_stdout, org1_stderr) => {
		
		    if (org1_error) {
				console.error(`exec error: ${org1_error}`);
				return;
		    }
			
			fs.moveSync('./force-app/main', './org_compare/'+this.flags.org1);
			
			if(this.flags.org2){
				
				exec('sfdx force:source:retrieve -x ./manifest/package.xml -u '+ this.flags.org2,{maxBuffer: 1024 * 1024 * 10}, (org2_error, org2_stdout, org2_stderr) => {
							
					if (org2_error) {
						console.error(`exec error: ${org2_error}`);
						return;
					}
					fs.moveSync('./force-app/main', './org_compare/'+this.flags.org2);
					this.compare();
				});
			}
			else{
				this.flags.org2 = 'source';
				this.compare();
			}
	});
	
  }
  public compare(){
	  
		
		console.log('Comparing...'+this.flags.org1+' and '+this.flags.org2);
		
		
		var org1Key = this.flags.org1 + '_missing';
		var org2Key = this.flags.org2 + '_missing';
		var results = {content_change: {}};
		results[org1Key] = {};
		results[org2Key] = {};
					
		
		var options = {
		  compareContent: true,
		  compareFileSync: dircompare.fileCompareHandlers.lineBasedFileCompare.compareSync,
		  compareFileAsync: dircompare.fileCompareHandlers.lineBasedFileCompare.compareAsync,
		  ignoreLineEnding: true,
		  ignoreWhiteSpaces: true,
		  noDiffSet: false,
		  resultBuilder:  function (entry1, entry2, state, level, relativePath, options, statistics, diffSet, reason) {
				if(state != 'equal'){
					
					
					if(entry1 && entry2){
						
						if(!results.content_change.hasOwnProperty(relativePath)){
							results.content_change[relativePath] = [];
						}
						else{
							results.content_change[relativePath].push(entry1.name);
						}
					}
					else if(entry1 && !entry2){
						
						if(!results[org2Key].hasOwnProperty(relativePath)){
							results[org2Key][relativePath] = [];
						}
						else{
							results[org2Key][relativePath].push(entry1.name);
						}
					}
					else{
						if(!results[org1Key].hasOwnProperty(relativePath)){
							results[org1Key][relativePath] = [];
						}
						else{
							results[org1Key][relativePath].push(entry2.name);
						}
					}
				}	
		  }
		};

		dircompare.compare('./org_compare/'+this.flags.org1, './org_compare/'+this.flags.org2, options).then(res => {
			var writeStream = fs.createWriteStream('./org_compare/results.txt');
			writeStream.write(JSON.stringify(results));
			writeStream.end();			
			console.log('Success! Comparision results: /org_compare/results.txt. Copy contents to any online JSON viewer tool.');
			if(this.flags.org2 == 'source'){
				
				fs.copySync('./org_compare/source','./force-app/main');
			}
			else if(fs.existsSync('./org_compare/backup')){
				
				fs.copySync('./org_compare/backup','./force-app/main');
			}
		});
  }
  
}
