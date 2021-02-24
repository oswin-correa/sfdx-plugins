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

-----------------
Mass Replace 
-----------------
Description: This utility can perform  replace all or find all functionality for nested directory structure

Utility to mass replace directory contents

USAGE
  $ sfdx utils:replace -p <string> -k <string> -r <string> [-c] [-i] [--json] [--loglevel trace|debug|info|warn|error|fatal]

OPTIONS
  -c, --check                                     Check only
  -i, --caseignore                                Ignore Case
  -k, --key=key                                   (required) Find Term
  -p, --path=path                                 (required) Path of Directory
  -r, --replace=replace                           (required) Replace Term
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  [default: warn] logging level for this command invocation

EXAMPLE
  sfdx utils:replace -p D:OFFICEMMworkspaceMyOrgsrc -k Account -r Test -i -c
     [ 'D:/OFFICE/MMworkspace/MyOrg/src/classes/createcontactclass.cls']

-----------------
Metadata Creator
-----------------
Description: This utility can generate metadata components supporting creation and destructive deployements

Currently supported metadata types: PlatformEventChannelMember

Prerequisite
1. Context folder should have inputs.txt file if path to comma seperate file is not passed
2. Copy templates folder from the  repo cloned folder(sfdx-plugin) and place it in the context folder

Creates and deletes metadata for a specified org

USAGE
  $ sfdx utils:createMetadata [-w <integer>] [-b <integer>] [-f <filepath>] [-c] [-x] [-m <string>] [-d] [-s] [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal]

OPTIONS
  -b, --batchsize=batchsize                       [default: 5] Batch Size
  -c, --check                                     Validate and donot deploy
  -d, --isdestructive                             To delete components
  -f, --filepath=filepath                         [default: inputs.txt] Path to comma seperated fully qualified object API names to which CDC has to be enabled
  -m, --metadatatype=metadatatype                 [default: PlatformEventChannelMember] Metadata type
  -s, --isscratchorg                              Is Scratch Org?
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  -w, --deploymenttimelimit=deploymenttimelimit   [default: 200] How many minutes to wait for the deployment to finish
  -x, --createxmlfile                             Create xml files along with the components
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  [default: warn] logging level for this command invocation

-----------------
Org Compare
-----------------
Description: This utility provisions a comparision of artifacts between two salesforce orgs or a existing SFDX project and a org.

Prerequisite
1. Always run within a SFDX project with manifest, Recommended to create a new project when comparing two orgs
2. Update the package.xml in manifest folder accordingly, as the comparision orgs metadata is pulled considering this. 

Creates a folder org_compare with a results.txt file. Paste this is any JSON viewer tool to get a detailed information regarding the comparision results

Compare two salesforce orgs and generates report

USAGE
  $ sfdx utils:orgCompare -x <string> [-y <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal]

OPTIONS
  -x, --org1=org1                                 (required) Username of Org1
  -y, --org2=org2                                 Username of Org2
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  [default: warn] logging level for this command invocation

-----------------
List Objects
-----------------
Description: This utlity lists the objects from a org and also considers user custom additions to form a delimited file.

Lists the objects in the org as per specified de-limiter

USAGE
  $ sfdx utils:listObjects [-d <string>] [-c <string>] [-a <filepath>] [-i <filepath>] [-p <filepath>] [-s <string>] [-e <string>] [-u <string>] [--apiversion <string>]
  [--json] [--loglevel trace|debug|info|warn|error|fatal]

OPTIONS
  -a, --includelist=includelist                   Path to the comma seperated file to include
  -c, --sobjecttypecategory=sobjecttypecategory   [default: custom] The type of objects to list: all, custom, or standard.
  -d, --delimiter=delimiter                       [default: ,] Delimiter
  -e, --endswithfilter=endswithfilter             Includes objects that ends with specific keywords(Comma seperated)
  -i, --excludelist=excludelist                   Path to the comma seperated file to exclude
  -p, --path=path                                 [default: inputs.txt] Path to the result file
  -s, --startswithfilter=startswithfilter         Includes objects that starts with specific keywords(Comma seperated)
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  [default: warn] logging level for this command invocation


       









