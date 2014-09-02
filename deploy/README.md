##Deployment Scripts
The DRE has an accompanying deployment script to get an instance running located in this directory.  The system uses Ansible to automate deployment.  To learn more about Ansible, visit [docs.ansible.com](http://docs.ansible.com/).

Additionally, this deployment script is designed to work with a Vagrant instance.  Vagrant automates the creation of virtual machines on local computers.  For more information on Vagrant, visit [www.vagrantup.com](https://www.vagrantup.com/).

Note:  These scripts are designed to work with Red Hat Enterprise Linux 6.5 (or equivalent CentOS).

###Vagrant Instructions

Navigate to /vagrant folder of this directory, and type:
```
vagrant up
```

Vagrant will automatically execute the Ansible script and deploy the instance locally.

You can access the box via ssh by typing: 
```
vagrant ssh
```


###Server Instructions


Check if mongo is running (on server):

service mongod status

To get a webserver running, you need to specify a hosts file, and a private key, and the script: