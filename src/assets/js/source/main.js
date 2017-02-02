/**
 * Created by Johnny on 2016-07-29.
 */
(function ($, window, document, undefined) {
    'use strict';

    /**
     * Ready Event
     */
    $(document).ready(function () {
        //
        handleMap();
        handleGallery();
    });

    /**
     * Scroll Event
     */
    $(window).on('scroll', function () {
        //
    });

    /**
     * Load Event
     */
    $(window).on('load', function () {
        /** */
        $(window)
            .trigger('scroll')
            .trigger('resize');
    });

    /**
     * Resize Event
     */
    $(window).on('resize orientationchange', function () {
        //
    });

    function handleMap() {

        // create google map
        var map = new google.maps.Map(document.getElementById('ml-gmap'),{
            zoom: 10,
            center: new google.maps.LatLng(49.802609, 19.962903),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            maxZoom: 14
        });

        //show location details
        var showLocationDetails = function(id) {
            var _el = $('.ml-entry-location').eq(id),
                detailsWrapper = _el.children('.ml-entry-more-details');

            detailsWrapper.addClass('show-details');
        };

        //show location details
        var hideLocationDetails = function(id) {
            var _el = $('.ml-entry-location').eq(id),
                detailsWrapper = _el.children('.ml-entry-more-details');

            detailsWrapper.removeClass('show-details');
        };

        // add markers to map
        var allMarkers = [];
        var locations = $('.ml-locations .ml-entry-location');
        locations.each(function (index) {
           var _el = $(this),
               lat = _el.data('lat'),
               lng = _el.data('lng');

            if(lat && lng) {
                var marker = new google.maps.Marker({
                    position: {lat: parseFloat(lat), lng: parseFloat(lng)},
                    map: map,
                    icon: 'http://maps.google.com/mapfiles/ms/micons/red.png'
                })
                .addListener('click', function () {
                    resetLocations($('.ml-entry-location'),true);
                    resetMarkerIcons();
                    this.setIcon('http://maps.google.com/mapfiles/ms/micons/green.png');
                    showLocationDetails(index);
                });

                allMarkers.push(marker);
            }
        });


        var resetMarkerIcons = function () {
            for(var i = 0; i < allMarkers.length; i++) {
                console.log(allMarkers[i].Ia);
                allMarkers[i].Ia.setIcon('http://maps.google.com/mapfiles/ms/micons/red.png');
            }
        };

        // handle show/hide list
        var ctaList = $('.ml-gotolist');
        ctaList.on('click', function () {
           var _el = $(this),
               locList = $('.ml-location-list');

            locList.toggleClass('list-active');

            if(locList.hasClass('list-active')) {
                _el.text('Schowaj liste');
            } else {
                _el.text('Pokaż liste');
            }

        });

        // handle show/hide location details

        $('.ml-show-location-details').on('click', function () {
            var _el = $(this),
                detailsWrapper = _el.next(),
                location = _el.closest('.ml-entry-location'),
                locations = $('.ml-entry-location');

            if(!detailsWrapper.hasClass('show-details')) {
                showLocationDetails(location.index());
                for(var i = 0; i < locations.length; i++) {
                    if(i !== location.index()) {
                        hideLocationDetails(i);
                    }
                }
            } else {
                hideLocationDetails(location.index());
            }
        });

        //center on single location or region
        var centerOnSelectedRegion = function(location, isSinglePlace) {
            var lat = location.data('lat'),
                lng = location.data('lng');

            if (isSinglePlace) {
                map.setCenter({lat: parseFloat(lat), lng: parseFloat(lng)});
                map.setZoom(20);
            } else {
                map.setCenter({lat: parseFloat(lat), lng: parseFloat(lng)});
                map.setZoom(13);
            }
        };

        //reset selected locations
        var resetLocations = function (locations, stayInRegion) {
            resetMarkerIcons();
            locations.each(function (index) {
                hideLocationDetails(index);
                if($(this).hasClass('selected-region') && !stayInRegion) {
                    $(this).removeClass('selected-region');
                }
            });
            if(!stayInRegion) {
                map.setCenter({lat: parseFloat(49.802609), lng: parseFloat(19.962903)});
                map.setZoom(10);
            }
        };

        //handle select region
        var selectRegion = $('#ml-location-region');
        selectRegion.on('change', function () {
            var _el = $(this),
                selectedVal = _el.val(),
                locationsWrapper = $('.ml-locations'),
                locations = $('.ml-entry-location');

            if($('#ml-search-locations').val() !== '') {
                $('#ml-search-locations').val('');
            }

            if(selectedVal === 'All') {
                if(locationsWrapper.hasClass('region-selections-active')) {
                    locationsWrapper.removeClass('region-selections-active');
                }
            } else {
                if(!locationsWrapper.hasClass('region-selections-active')) {
                    locationsWrapper.addClass('region-selections-active');
                }
            }

            var setSelectedLocations = function () {
                if(selectedVal !== 'All') {
                    locations.each(function () {
                       var _el = $(this);
                        if(_el.data('cat') === selectedVal) {
                            _el.addClass('selected-region');
                        }
                    });
                    centerOnSelectedRegion($('.selected-region').eq(0));
                }
            };
            resetLocations(locations);
            setSelectedLocations();
        });

        // set selected/searched single location
        var setSelectedLocation = function (id) {
            var locationsWrapper = $('.ml-locations'),
                locations = $('.ml-entry-location'),
                _el = locations.eq(id);

            resetLocations(locations);
            if(!locationsWrapper.hasClass('region-selections-active')) {
                locationsWrapper.addClass('region-selections-active');
            }
            _el.addClass('selected-region');

            centerOnSelectedRegion(_el, true);
        };

        //create array of locations
        var createArrayForSearch = function () {
            var places = [];

            locations.each(function () {
                var _el = $(this),
                    place = _el.data('place'),
                    region = _el.data('cat');

                places.push(place + ', ' + region);
            });

            return places;
        };

        //handle search locations
        $('#ml-search-locations').autocomplete({
            lookup: createArrayForSearch(),
            paramName: 'searchString',
            onSelect: function (str) {
                var itemId = createArrayForSearch().indexOf(str.value);
                setSelectedLocation(itemId);
                showLocationDetails(itemId);
                resetMarkerIcons();
                allMarkers[itemId].Ia
                    .setIcon('http://maps.google.com/mapfiles/ms/micons/green.png');
                $('#ml-location-region').val('All');
            },
            onHide: function() {
                if($(this).val() === '') {
                    resetLocations($('.ml-entry-location'));
                    if($('.ml-locations').hasClass('region-selections-active')) {
                        $('.ml-locations').removeClass('region-selections-active');
                    }
                }
            }
        });
    }

    function handleGallery() {
        //gallery
        $('.ml-entry-gallery').featherlightGallery({
            previousIcon: '&#9664;',
            nextIcon: '&#9654;',
            galleryFadeIn: 100,
            galleryFadeOut: 300,
        });
    }
})(jQuery, window, document);