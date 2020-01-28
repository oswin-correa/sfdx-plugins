sfdx-plugins
============

Utilties to SFDX projects

Prerequisite
1. GIT
2. SFDX CLI

To Link:
1. Open console/terminal, Clone this repo and navigate to 'sfdx-plugins'
2. run sfdx plugins:link

Utilities Usage:

1. Mass Replace 
Description: This utility can perform  replace all or find all functionality for nested directory structure

Example: sfdx utils:replace -p D:\OFFICE\MMworkspace\MyOrg\src -k Account -r Test -i -c

p: Path to the directory (Ideally should be pointing to default folder of the sfdx project,where the codebase resides for a ideal namespace replacement case)
k: keyword to be replaced
r: Keyword to which above has to be replaced
i: To support ignore case
c: To check only and doesn't replace

2. Metadata Creator
Description: This utility can generate metadata components supporting creation and destructive deployements
Currently supported metadata types: PlatformEventChannelMember

Prerequisite
1. Context folder should have inputs.txt file if path to comma seperate file is not passed
2. Copy templates folder from the  repo cloned folder(sfdx-plugin) and place it in the context folder

Example: sfdx utils:createMetadata -u elem-23710@elementpboscratch.org 

w: How many minutes to wait for the deployment to finish
b: Batch Size
f: Path to comma seperated fully qualified object API names, if not inputs.txt should be present in context folder 
c: Validate only
x: Create xml files along with the components
m: Metadata type
d: Destrutive support
u: org Id









