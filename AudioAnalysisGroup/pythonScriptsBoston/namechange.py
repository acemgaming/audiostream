import os

fil = "/home/bzachmann/Documents/test.mp3"
ti = "Hello, Brooklyn"
ar = "All Time Low"
al = "Nothing Personal"


#takes the full filepath (example: /home/bzachmann/Documents/test.mp3) 
#and some meta data to format a new filename and rename the file in the filepath
#the function returns the new filepath
def changename(filepath, title, artist, album):
	titlelow = title.lower()
	titlefinal = titlelow.replace(" ", "-")
	artistlow = artist.lower()
	artistfinal = artistlow.replace(" ", "-")
	albumlow = album.lower()
	albumfinal = albumlow.replace(" ", "-")

	finalstrings = [titlefinal, artistfinal, albumfinal]
	outstrings = ["", "", ""]
	acceptedc = ['-','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9']
	
	for x in range(0, 3):
		for character in finalstrings[x]:
			if character in	acceptedc:
				if len(outstrings[x]) < 30:
					outstrings[x]= outstrings[x] + character

	newname = outstrings[0] + "_" + outstrings[1] + "_" + outstrings[2] + ".mp3"

	filesplits = os.path.split(filepath)
	path = filesplits[0]
	
	newfilepath = os.path.join(path, newname)
	os.rename(filepath, newfilepath)
	return newfilepath
	
	

newpath = changename(fil, ti, ar, al)
print newpath
