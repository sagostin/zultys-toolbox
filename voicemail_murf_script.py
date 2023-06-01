# take csv file for users from zultys
# dump voicemail greeting text to .txt file with following format for each user
# You have reached *name* @ extension *extension*. Please leave a message.

import csv

# First Name,Last Name,Extension,User Profile,Fax DID,Voice DID,Paging Profile,Caller ID,ID for MS Exchange,
# Home Phone,Cell Phone,Fax Number,E-mail,Alternate E-mail,User Name,Pseudonym,ID,Admin Profile,Recording Profile,
# Home MX,Current MX,Default Role,Assigned Device(s),LDAP Authentication,Password,PIN

filename = str(input("Enter input file name with extension (MUST BE .csv format): "))

users = []

with open(filename, 'r') as csvfile:
    dataReader = csv.reader(csvfile)
    for row in dataReader:
        users.append({"firstname": row[0], "lastname": row[1], "extension": row[2]})

fileName = str(input("Enter output file name with extension: "))

for user in users:
    f = open(fileName, "a")
    f.write("You have reached " + user['firstname'] + " " + user['lastname'] + " @ extension "+user['extension']+", if you have reached the wrong voicemail, press 0 now. Otherwise remain on the line to leave a message.\n")
    f.close()
