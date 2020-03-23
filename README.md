sfdx-plugins
============

Utilties to SFDX projects

Prerequisite
------------

1. GIT
2. SFDX CLI

To Link:
---------

1. Open console/terminal, Clone this repo and navigate to 'sfdx-plugins'
2. run sfdx plugins:link


Mass Replace 
------------
Description: This utility can perform  replace all or find all functionality for nested directory structure

Example: sfdx utils:replace -p D:\OFFICE\MMworkspace\MyOrg\src -k Account -r Test -i -c

p: Path to the directory. Ideally should be pointing to default folder of the sfdx project,where the codebase resides for a ideal namespace replacement case

k: keyword to be replaced

r: Keyword to which above has to be replaced

i: To support ignore case

c: To check only and doesn't replace



Metadata Creator
-----------------
Description: This utility can generate metadata components supporting creation and destructive deployements

Currently supported metadata types: PlatformEventChannelMember

Prerequisite
1. Context folder should have inputs.txt file if path to comma seperate file is not passed
2. Copy templates folder from the  repo cloned folder(sfdx-plugin) and place it in the context folder

Example: sfdx utils:createMetadata -u org@scratch.org 

w: How many minutes to wait for the deployment to finish

b: Batch Size

f: Path to comma seperated fully qualified object API names, if not inputs.txt should be present in context folder 

c: Validate only

x: Create xml files along with the components

m: Metadata type

d: Destrutive support

u: org Id

Org Compare
-----------------
Description: This utility provisions a comparision of artifacts between two salesforce orgs or a existing SFDX project and a org.

Prerequisite
1. Always run within a SFDX project with manifest, Recommended to create a new project when comparing two orgs
2. Update the package.xml in manifest folder accordingly, as the comparision orgs metadata is pulled considering this. 

Example: 
sfdx utils:orgCompare -x compareorg@scratch.org -> When SFDX project already has a source for comparision
sfdx utils:orgCompare -x  compareorg1@scratch.org -y compareorg2@scratch.org 

Create a folder org_compare with a results.txt file. Paste this is any JSON viewer tool to get a detailed information regarding the comparision results


x: UserName of Org 1

y: UserName of Org2 (Optional)        

       









