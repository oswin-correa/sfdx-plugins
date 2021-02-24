import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { exec } from 'child_process';
const fs = require('fs-extra');

export default class listObjects extends SfdxCommand {

  public static description = 'Lists the objects in the org as per specified de-limiter';

  protected static flagsConfig = {
	delimiter: flags.string({ char: 'd', description: 'Delimiter', required: false, default: ',' }),
	sobjecttypecategory: flags.string({ char: 'c', description: 'The type of objects to list: all, custom, or standard.', required: false, default:'custom'}),
	includelist: flags.string({ char: 'a', description: 'Path to the comma seperated file to include', required: false}),
	excludelist: flags.filepath({ char: 'i', description: 'Path to the comma seperated file to exclude', required: false}),
	path: flags.filepath({char: 'p', description: 'Path to the result file',required:false,default:'inputs.txt'}),
	startswithfilter: flags.string({char: 's', description: 'Includes objects that starts with specific keywords(Comma seperated)',required:false,default:''}),
	endswithfilter: flags.string({char: 'e', description: 'Includes objects that ends with specific keywords(Comma seperated)',required:false,default:''})
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;
 
  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = false;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

	public async run(): Promise < AnyJson > {

		console.log('Process initiated.This may take a while...');

		exec('sfdx force:schema:sobject:list --json -c ' + this.flags.sobjecttypecategory + ' -u ' + this.org.getUsername(), (error, stdout, stderr) => {
			
			if (error) {
				console.error(`exec error: ${error}`);
				return;
			}
			var response = JSON.parse(stdout);
			var results = response.result;

			this.flags.excludelist = this.flags.excludelist.trim();
			this.flags.startswithfilter = this.flags.startswithfilter.trim();
			this.flags.endswithfilter = this.flags.endswithfilter.trim();
			this.flags.includelist = this.flags.includelist.trim();

			if(this.flags.excludelist){

				var contents = fs.readFileSync(this.flags.excludelist, 'utf8');
				var ignorelist = contents.split(',');

				if(ignorelist){
					results = results.filter(function(result) {
						for (var i = 0; i < ignorelist.length; i++) {
							if(result.toLowerCase() === ignorelist[i].toLowerCase()){
								return false;
							}
						}
						return true;
					});
				}
			}

			if(this.flags.startswithfilter){
				
				var startswithfilter = this.flags.startswithfilter.split(',');
				results = results.filter(function(result) {
					for (var i = 0; i < startswithfilter.length; i++) {
						if(result.toLowerCase().startsWith(startswithfilter[i].toLowerCase())){
							return true;
						}
					}
					return false;
				});
			}
			
			if(this.flags.endswithfilter){
				
				var endswithfilter = this.flags.endswithfilter.split(',');
				results = results.filter(function(result) {
					for (var i = 0; i < endswithfilter.length; i++) {
						if(result.toLowerCase().endsWith(endswithfilter[i].toLowerCase())){
							return true;
						}
					}
					return false;
				});
			}
			
			if (this.flags.includelist){

				var contents = fs.readFileSync(this.flags.includelist, 'utf8');
				var includelist = contents.split(',');
				results = Array.from(new Set(results.concat(includelist)));
			}
			
			var output = results.join(this.flags.delimiter);
			fs.outputFileSync(this.flags.path, output);
			console.log('Success! Path: '+this.flags.path);

		});
	}
}
