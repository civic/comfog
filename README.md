comfog
======
Chrome Extension setting page framework.

### Create Instance
	var instance = comfog(config_object);

### Render Setting Page
Use setup method.

	var instance = comfog(config_object);
	instance.renderTo("body");	// "body" is jquery selector

### About Config Object

#### example
	comfog({
		tabs: [
			{					//a tab config
				label: ""
				items: [
					{id: "", label: "", form{}},	//a setting config
					...
				]
			},
			...
		]
	});

/tabs				{Array}	tab settings   
/tabs/[]/label		{String} tab caption  
/tabs/[]/items		{Array} setting items  
/tabs/[]/items/[]/id	{String} setting element id  
/tabs/[]/items/[]/label	{String} settting element caption  
/tabs/[]/items/[]/form	{Object} form config of this element  

### form object
Form object for input/output setting.

**(All types)**

	form: {
		type: "fieldType", 	//field type 
		def: "default", 	//default value.
		size: 10			//field display size
		listeners: {
			"click": function		//event listener
		}
	}

**Text**

	form: {type: "text", def: "", size: 10}

**NumText**

	form {type: "numtext", def: 10, size: 3
		max: 10, 	//range upper
		min: 0		//range lower
	}

**Checkboxk**

	form {type: "checkbox", def: true}

