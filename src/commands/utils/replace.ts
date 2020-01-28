import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
const replace = require('replace-in-file');

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdx-plugins', 'replace');

export default class Replace extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
  `sfdx utils:replace -p D:\OFFICE\MMworkspace\MyOrg\src -k Account -r Test -i -c
  [ 'D:/OFFICE/MMworkspace/MyOrg/src/classes/createcontactclass.cls']
  `
  ];


  protected static flagsConfig = {

    path: flags.string({char: 'p', description: messages.getMessage('pathFlagDescription')}),
	check: flags.boolean({char: 'c', description: messages.getMessage('checkFlagDescription')}),
	key: flags.string({char: 'k', description: messages.getMessage('keyFlagDescription')}),
	replace: flags.string({char: 'r', description: messages.getMessage('replaceFlagDescription')}),
	caseignore: flags.boolean({char: 'i', description: messages.getMessage('caseignoreFlagDescription')}),
	
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = false;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = false;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<AnyJson> {
	  
    const options = {
	  files: [this.flags.path + '//*',
			  this.flags.path + '//*//*',
			  this.flags.path + '//*//*//*',
			  this.flags.path + '//*//*//*//*',
			  this.flags.path + '//*//*//*//*//*',
			  ],
	  from: new RegExp(this.flags.key, this.flags.caseignore ? 'gi' : 'g'),
	  to: this.flags.replace,
	  allowEmptyPaths: true,
	  dry: this.flags.check
	};
	
	replace(options)
	  .then(results => {
	  
	    const changedFiles = results
		  .filter(result => result.hasChanged)
		  .map(result => result.file);
		  
		console.log(changedFiles);
	  })
	  .catch(error => {
		console.error('Error occurred:', error);
	});
  }
}
