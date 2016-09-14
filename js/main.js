// These are the features that will be shown to the user.
// Normally we'd have these in a database instead.
var locations = 
	[
	  {
		title: 'North Carolina Museum of Science',
		location: {lat: 35.782274,lng: -78.639550}
	  },
	  {
		title: 'Raleigh Convention Center',
		location: {lat: 35.773646,lng: -78.641350}
	  },
	  {
		title: 'Lincoln Theater',
		location: {lat: 35.7795897,lng: -78.6381787}
	  },
	  {
		title: 'Duke Energy Center for the Performing Arts',
		location: {lat: 35.771467,lng: -78.639555}
	  },
	  {
		title: 'North Carolina State Capitol',
		location: {lat: 35.780568,lng: -78.639117}
	  },
	  {
		title: 'William Peace University',
		location: {lat: 35.789286,lng: -78.637452}
	  },
	  {
		title: 'Central Prison',
		location: {lat: 35.776388,lng: -78.656255}
	  },
	  {
		title: 'Saint Augustine\'s University',
		location: {lat: 35.784858,lng: -78.621310}
	  },
	  {
		title: 'D.H. Hill Library',
		location: {lat: 35.787512,lng: -78.669600}
	  },
	  {
		title: 'North Carolina Museum of History',
		location: {lat: 35.781785,lng: -78.638556}
	  },
	  {
		title: 'Wake County Justice Center',
		location: {lat: 35.776576,lng: -78.641139}
	  },
	  {
		title: 'Sacred Heart Cathedral',
		location: {lat: 35.780675,lng: -78.641971}
	  }
	];

// Feature constructor function
var Feature = function(data) {
	this.name = ko.observable(data.name);
	this.location = ko.observable(data.location);
	//this.lng = ko.observable(data.lng);
};


var ViewModel = function() {
	// Make self always reference the ViewModel
	var self = this;
	
	this.featureList = ko.observableArray([]);
	
	// Before can stuff data into catList, need to take that data and make a new cat out of each of those objects
	// So loop over each cat and push a new cat with each of the catItems into the catList
	locations.forEach(function(featureItem){
		self.featureList.push( new Feature(featureItem) );
	});
	
	this.setFeature = function(clickedFeature){
		self.currentFeature(clickedFeature);
	};
	
	// Just need to access the first element of the catList
	this.currentFeature = ko.observable( this.featureList()[0] );

	this.incrementCounter = function(){
		self.currentFeature().clickCount(self.currentFeature().clickCount() + 1);	
	};
	  
};

$(document).ready(function(){
	ko.applyBindings(new ViewModel());
});