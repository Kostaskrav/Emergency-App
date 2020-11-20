## INSTALLING PREREQUISITES AND THE APP

#### 1. install Nodejs it also contains npm, follow [this instructions](https://linuxize.com/post/how-to-install-node-js-on-ubuntu-18.04/)

#### 2. download MongoDB
	https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

#### 3. clone the project... daaaaa
	git clone git@gitlab.com:errikosg/texnologia_logismikou_2020.git
	OR
	git clone https://gitlab.com/errikosg/texnologia_logismikou_2020.git

#### 4. Install node packages used in our project
	cd project/front-end
	npm install
	cd project/back-end
	npm install
	
	OR use the CLI when we create it

#### 5. Some usefull addons for VS Code
	Bracket Pair Colorizer 2
	JavaScript (ES6) code snippets
	Visual Studio IntelliCode
	Add a custom theme you like

*PS: In VSCode if you write a markdown(.md) file like this one, you can press (Ctrl+Shift+V) to preview it.*

![VS Code IS the best IDE.](./front-end/images/jd0tny4uj2i31.jpg)

#### 6. Download Postman API Dev Enviroment (you probably have it)
	Download via Ubuntu software center

#### 7. Downdload a MongoDB GUI (optional)
	Robo3T is the coresponding mySQL Workench for mongo.
	Follow the link https://robomongo.org/download
	download the .tar.gz and extract it anywhere. You should have an other tar.gz and a .sh.
	Open a terminal in the folder and run the sh.
	sudo bash studio-3t-linux-x64.sh
	This will install Studio3T, after the installation you can delete the folder.

## DEVELOPMENT
you can check your enviromental variables with

	printenv [variable name]

IN ORDER TO BUILD THE BACKEND RUN

	npm run seed && npm run populate

If you edit the cli-client remember to install it
	
	npm install control-center -g

## PRODUCTION
	export NODE_ENV=production

## Testing
	export NODE_ENV=testing