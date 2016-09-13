// These are the features that will be shown to the user.
// Can put these in a database instead.
var locations = 
	[
	  {
		name: 'North Carolina Museum of Science',
		lat: 35.782274,
		lng: -78.639550
	  },
	  {
		name: 'Raleigh Convention Center',
		lat: 35.773646,
		lng: -78.641350
	  },
	  {
		name: 'Lincoln Theater',
		lat: 35.7795897,
		lng: -78.6381787
	  },
	  {
		name: 'Duke Energy Center for the Performing Arts',
		lat: 35.771467,
		lng: -78.639555
	  },
	  {
		name: 'North Carolina State Capitol',
		lat: 35.780568,
		lng: -78.639117
	  },
	  {
		name: 'William Peace University',
		lat: 35.789286,
		lng: -78.637452
	  },
	  {
		name: 'Central Prison',
		lat: 35.776388,
		lng: -78.656255
	  },
	  {
		title: 'Saint Augustine\'s University',
		lat: 35.784858,
		lng: -78.621310
	  },
	  {
		name: 'D.H. Hill Library',
		lat: 35.787512,
		lng: -78.669600
	  },
	  {
		name: 'North Carolina Museum of History',
		lat: 35.781785,
		lng: -78.638556
	  },
	  {
		name: 'Wake County Justice Center',
		lat: 35.776576,
		lng: -78.641139
	  },
	  {
		name: 'Sacred Heart Cathedral',
		lat: 35.780675,
		lng: -78.641971
	  }
	];

// Feature constructor function
var Feature = function(data) {
	this.name = ko.observable(data.name);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);
};


var ViewModel = function() {
	// Make self always reference the ViewModel
	var self = this;
	
	this.featureList = ko.observableArray([]);

	
	// Before can stuff data into featureList, need to take that data and make a new feature out of each of those objects
	// So loop over each feature and push a new feature with each of the featureItems into the featureList
	locations.forEach(function(featureItem){
		self.featureList.push( new Feature(featureItem) );
		console.log(self.featureList());
	});
	
	this.setFeature = function(clickedFeature){
		self.currentFeature(clickedFeature);
	};
	
	// Just need to access the first element of the featureList
	this.currentFeature = ko.observable( this.featureList()[0] );

	this.incrementCounter = function(){
		self.currentFeature().clickCount(self.currentFeature().clickCount() + 1);	
	};
	  
};

ko.applyBindings(new ViewModel());