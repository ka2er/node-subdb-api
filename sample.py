import os
import hashlib

#this hash function receives the name of the file and returns the hash code
def get_hash(name):
    readsize = 64 * 1024
    with open(name, 'rb') as f:
        data = f.read(readsize)
        print "%s" % hashlib.md5(data).hexdigest()
        #print "%0x16%" % data
        f.seek(-readsize, os.SEEK_END)
        data2 = f.read(readsize)
        print "%s" % hashlib.md5(data2).hexdigest()
        data += data2
    return hashlib.md5(data).hexdigest()


print "%s" % get_hash('./test/dexter.mp4')