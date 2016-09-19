// Consulted: http://www.9bitstudios.com/2014/03/getting-data-from-the-wikipedia-api-using-jquery/
var map;
var marker;
function error_handler() {
  alert("Google Maps cannot connect. Please try again.");
}
function createMarker(latlng) {
  marker = new google.maps.Marker({
    position: latlng,
    map: map,
    animation: null
  });
  return marker;
}
// Model data
var locations = [
	  {
		name: 'North Carolina Museum of Science',
		lat: 35.782274,
		lng: -78.639550,
		wikiSnippet: ''
	  },
	  {
		name: 'Raleigh Convention Center',
		lat: 35.773646,
		lng: -78.641350,
		wikiSnippet: ''
	  },
	  {
		name: 'Lincoln Theater',
		lat: 35.7795897,
		lng: -78.6381787,
		wikiSnippet: ''
	  }/*,
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
		name: 'Saint Augustine\'s University',
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
	  }*/
];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
	center: {lat: 35.7904, lng: -78.6369},
	zoom: 14,
	styles: [
	{
	  "featureType": "landscape",
	  "stylers": [
		{
		  "hue": "#FFBB00"
		},
		{
		  "saturation": 43.400000000000006
		},
		{
		  "lightness": 37.599999999999994
		},
		{
		  "gamma": 1
		}
	  ]
	},
	{
	  "featureType": "road.highway",
	  "stylers": [
		{
		  "hue": "#FFC200"
		},
		{
		  "saturation": -61.8
		},
		{
		  "lightness": 45.599999999999994
		},
		{
		  "gamma": 1
		}
	  ]
	},
	{
	  "featureType": "road.arterial",
	  "stylers": [
		{
		  "hue": "#FF0300"
		},
		{
		  "saturation": -100
		},
		{
		  "lightness": 51.19999999999999
		},
		{
		  "gamma": 1
		}
	  ]
	},
	{
	  "featureType": "road.local",
	  "stylers": [
		{
		  "hue": "#FF0300"
		},
		{
		  "saturation": -100
		},
		{
		  "lightness": 52
		},
		{
		  "gamma": 1
		}
	  ]
	},
	{
	  "featureType": "water",
	  "stylers": [
		{
		  "hue": "#0078FF"
		},
		{
		  "saturation": -13.200000000000003
		},
		{
		  "lightness": 2.4000000000000057
		},
		{
		  "gamma": 1
		}
	  ]
	},
	{
	  "featureType": "poi",
	  "stylers": [
		{
		  "hue": "#00FF6A"
		},
		{
		  "saturation": -1.0989010989011234
		},
		{
		  "lightness": 11.200000000000017
		},
		{
		  "gamma": 1
		}
	  ]
	}
  ]
  });
  
  var infowindow;
  infowindow = new google.maps.InfoWindow({
    maxWidth: 300,
    content: null
  });
  
  var viewModel = function() {
    var self = this;
    self.locations = ko.observableArray(locations);
    self.value = ko.observable('');
	self.wikiSnippet = ko.observable('');
    for (var i = 0; i < locations.length; i++) {
      locations[i].marker = createMarker(new google.maps.LatLng(locations[i].lat, locations[i].lng));
    }
    self.locations().forEach(function(location) {
      var marker = location.marker;
      google.maps.event.addListener(marker, 'click', function() {
        var contentString = "<h1>" + location.name + "</h1>" + "<div class='wiki-blurb'>" + location.wikiSnippet + "</div>";
        infowindow.setContent(contentString);
        infowindow.open(map, marker);
        marker.setAnimation(google.maps.Animation.BOUNCE);	
        setTimeout(function(){
          marker.setAnimation(null);
        }, 1800);
      });
    });
	
	self.locationListLength = self.locations().length;
	console.log(self.locationListLength);
	
	self.search = ko.computed(function() {
      return ko.utils.arrayFilter(self.locations(), function(place) {
		  
		// Check if search matches location array title
        var match = place.name.toLowerCase().indexOf(self.value().toLowerCase()) >= 0;
		
		// Show the marker
        place.marker.setVisible(match);
		
        return match;
      });
    });
	

	// Gets data from Wikipedia, populates search with wikiSnippets
	this.getWikiData = function() {
		var wikiQuery;

		// If the wikiRequest times out, then display a message with a link to the Wikipedia page.
		var wikiRequestTimeout = setTimeout(function() {
			var phrase = 'Failed to get Wikipedia resources.  Please check your internet connection or click here: <a href="';
			var wikiLink = 'https://en.wikipedia.org/wiki/';
console.log(self.locations().wikiSnippet);
			for(var i=0; i<self.locationListLength; i++) {
				self.locations()[i].wikiSnippet(phrase + wikiLink + self.locations()[i].name() + '" target="_blank">' + self.locations()[i].name() + '</a>');
			}
		}, 4000);

		for(var i=0; i<self.locationListLength; i++) {
			wikiQuery = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + self.locations()[i].name() + '&srproperties=snippet&format=json&callback=wikiCallback';

			$.ajax({url: wikiQuery,
				dataType:'jsonp',
				success: function(data) {
					// Go through the list and find the correct item, then add the wikiSnippet data
					for(var i=0; i<self.locationListLength; i++) {
						if(data[1][0] == self.locations()[i].name()) {
							self.locations()[i].wikiSnippet(data[2][0]);
						}
					}

					clearTimeout(wikiRequestTimeout);
				}
			});
		}
	};
	
	// Get data from Wikipedia, populate locationList with the info
	self.getWikiData();

	
    self.openInfowindow = function(location) {
      google.maps.event.trigger(location.marker, 'click');
    }
  };
  ko.applyBindings(new viewModel());
}