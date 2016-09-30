// Consulted: http://www.9bitstudios.com/2014/03/getting-data-from-the-wikipedia-api-using-jquery/
var map;
var marker;
function error_handler() {
  alert("Google Maps cannot connect. Please try again.");
}
// Create map markers
function createMarker(latlng, name) {
var image = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
  marker = new google.maps.Marker({
    position: latlng,
    map: map,
	icon: image,
    animation: null,
    name: name
  });
  return marker;
}
// Model data
var locations = [
	  {
		name: 'Mordecai House',
		lat: 35.792842,
		lng: -78.633177,
		wikiSnippet: ''
	  },
	  {
		name: 'Raleigh Convention Center',
		lat: 35.773646,
		lng: -78.641350,
		wikiSnippet: ''
	  },
	  {
		name: 'Duke Energy Center for the Performing Arts',
		lat: 35.771467,
		lng: -78.639555,
		wikiSnippet: ''
	  },
	  {
		name: 'North Carolina State Capitol',
		lat: 35.780568,
		lng: -78.639117,
		wikiSnippet: ''
	  },
	  {
		name: 'Pullen Park',
		lat: 35.780361,
		lng: -78.660629,
		wikiSnippet: ''
	  },
	  {
		name: 'William G. Enloe High School',
		lat: 35.784247,
		lng: -78.603338,
		wikiSnippet: ''
	  },
	  {
		name: 'North Carolina Correctional Institution for Women',
		lat: 35.765795,
		lng: -78.622069,
		wikiSnippet: ''
	  },
	  {
		name: 'WRAL-TV',
		lat: 35.779411,
		lng: -78.673691,
		wikiSnippet: ''
	  },
	  {
		name: 'Moore Square Historic District',
		lat: 35.777275,
		lng: -78.636923,
		wikiSnippet: ''
	  },
	  {
		name: 'William Peace University',
		lat: 35.789286,
		lng: -78.637452,
		wikiSnippet: ''
	  },
	  {
		name: 'North Carolina Department of Correction',
		lat: 35.776388,
		lng: -78.656255,
		wikiSnippet: ''
	  },
	  {
		name: 'St. Augustine\'s University',
		lat: 35.784858,
		lng: -78.621310,
		wikiSnippet: ''
	  },
	  {
		name: 'D. H. Hill Library',
		lat: 35.787512,
		lng: -78.669600,
		wikiSnippet: ''
	  },
	  {
		name: 'North Carolina Museum of History',
		lat: 35.781785,
		lng: -78.638556,
		wikiSnippet: ''
	  },
	  {
		name: 'Sacred Heart Cathedral (Raleigh, North Carolina)',
		lat: 35.780675,
		lng: -78.641971,
		wikiSnippet: ''
	  }
];

function initMap() {
  // Create map object and add parameters
  map = new google.maps.Map(document.getElementById('map'), {
	center: {lat: 35.7804, lng: -78.6369},
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
  
  // Create infowindow object
  var infowindow;
	infowindow = new google.maps.InfoWindow({
	  maxWidth: 300,
	  content: null
  });
  
  
  var viewModel = function() {
    var self = this;
	// Set Knockout observables
    self.locations = ko.observableArray(locations);
    self.value = ko.observable('');
	self.wikiSnippet = ko.observable('');
	
    for (var i = 0; i < locations.length; i++) {
      locations[i].marker = createMarker(new google.maps.LatLng(locations[i].lat, locations[i].lng), locations[i].name);
    }
	
	// Sort list of locations alphabetically
	self.locations.sort(function(left, right) { 
		return left.name == right.name ? 0 : (left.name < right.name ? -1 : 1);
	});

    self.locations().forEach(function(location) {
      var marker = location.marker;
	  
      google.maps.event.addListener(marker, 'click', function() {
      	var marker = this,
      		name = marker.name;
      	self.getWikiData(marker, name);
        marker.setAnimation(google.maps.Animation.BOUNCE);
		marker.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png');
        setTimeout(function(){
          marker.setAnimation(null);
        }, 1400);
      });
    });

	
	self.locationListLength = self.locations().length;
	
	// Search function with filtering
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
	self.getWikiData = function(marker, name) {
		var wikiQuery,
		    locationName = name;

		// If the wikiRequest times out, then display a message with a link to the Wikipedia page.
		var wikiRequestTimeout = setTimeout(function() {
			var phrase = 'Failed to get Wikipedia resources.  Please check your internet connection or click here: <a href="';
			var wikiLink = 'https://en.wikipedia.org/wiki/';			
			alert(phrase + wikiLink + '" target="_blank">' + locationName + '</a>');
		}, 1500);

			wikiQuery = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + locationName + '&srproperties=snippet&format=json&callback=wikiCallback';

			$.ajax({url: wikiQuery,
				dataType:'jsonp',
				success: function(data) {
					//console.log(data[2]);
					var description = data[2];

					var contentString = '<h1>' + locationName + '</h1><div class="wiki-blurb"><p>' + description + '</p></div>';
                    infowindow.setContent(contentString);
                    infowindow.open(map, marker);

					//debugger;
		
					clearTimeout(wikiRequestTimeout);
				}
			});
		//}
	};
	
	// Opens an infowindow upon clicking a list item
    self.openInfowindow = function(location) {
      google.maps.event.trigger(location.marker, 'click');
    }
  };
  ko.applyBindings(new viewModel());
}