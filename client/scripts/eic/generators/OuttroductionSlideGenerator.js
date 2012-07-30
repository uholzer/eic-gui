/*jshint browser: true*/

define([ 'lib/jquery',
    'eic/generators/BaseSlideGenerator',
    'eic/TTSService', 'eic/FacebookConnector', 'lib/jvent'],
function ($, BaseSlideGenerator, TTSService, FacebookConnector, EventEmitter) {

  "use strict";

  var defaultDuration = 1000;

  /** Generator that creates outtroductory slides */
  function OuttroductionSlideGenerator(startTopic, endTopic, duration) {
    if (startTopic.type !== 'facebook')
      throw "The OuttroductionSlideGenerator only works with topics that are Facebook profiles.";

    this.fbConnector = new FacebookConnector();
    
    BaseSlideGenerator.call(this);
    this.slides = [];
    this.startTopic = startTopic;
    this.endTopic = endTopic;
    this.duration = duration || defaultDuration;
  }

  $.extend(OuttroductionSlideGenerator.prototype,
           BaseSlideGenerator.prototype,
  {
      init: function () {
        if (!this.inited) {
          var self = this;
          self.createSpeech();
          this.inited = true;
        }
      },

      /** Checks whether the outtro slide has been shown. */
      hasNext: function () {
        return this.done !== true;
      },

      getDuration: function () { return this.duration; },
      
      /** Advances to the outtro slide. */
      next: function () {
        if (!this.hasNext())
          return;

        var startTopic = this.startTopic,
            endTopic = this.endTopic,
            slide = this.createOuttroSlide('outtro', this.duration);

        this.done = true;

        return slide;
      },
      
      createOuttroSlide: function (cssClass, duration) {
        var startTopic = this.startTopic,
            endTopic = this.endTopic,
            slide = new EventEmitter();
      
        // Create slide element.
        slide.$element = $('<div>').addClass('slide')
                                   .addClass(cssClass)
                                   .attr('id',"outtro");

        var $outtro = $('<h1>').text("As you can see, ");
        slide.$element.append($outtro);
        setTimeout(function(){
          //$('#outtro > h2').append($('<br>'));
          $('#outtro > h1').append($('<em>').text(startTopic.first_name + ", "));
          
          setTimeout(function(){
            $('#outtro > h1').append($('<br>'));
            $('#outtro > h1').append("You are connected to everything in this world,");
            $('#outtro').parent().children('.transition-out').remove();
            setTimeout(function(){
              $('#outtro > h1').append($('<br>'));
              $('#outtro > h1').append($('<br>'));
              $('#outtro > h1').append("Including ");
              $('#outtro > h1').append($('<em>').text(endTopic.label));
              $('#outtro > h1').append("!");
              setTimeout(function(){
                addShares();
              },2000);
            },1000);
          },500);
        },1000);

        // Set duration.
        slide.duration = duration;
      
        // Set start and stop functions.
        slide.start = $.proxy(slide, 'emit', 'started');
        slide.stop  = $.proxy(slide, 'emit', 'stopped');
      
        return slide;
      },
      
      createSpeech: function () {
        var startTopic = this.startTopic,
            endTopic = this.endTopic,
            tts = new TTSService(),
            self = this;
        
        var text = "As you can see, " +
                   startTopic.first_name + ", " +
                   "You are connected to everything in this world," +
                   "Including " + endTopic.label + "!";
        
        tts.getSpeech(text, 'en_GB', function (response) {
          self.audioURL = response.snd_url;
        });
      }
    });

  function addShares() {
    $('#outtro').append($('<p>').append($('<br>'))
                                .append($('<br>'))
                                .append($('<br>'))
                                .append($('<br>'))
                                .append($('<br>'))
                                .append($('<br>')));
    /** Add Facebook button */
    $('#outtro').append($('<h2>').text('Share:'));
    var $fblike = $('<div>').addClass("fb-like")
                            .attr('data-href',"OUR URL")
                            .attr('data-send',"false")
                            .attr('data-layout',"button_count")
                            .attr('data-width',"112")
                            .attr('data-show-faces',"true")
                            .attr('style',"padding-left:4em");
    $('#outtro').append($fblike);
    // Render the button (Facebook API is already loaded)
    window.FB.XFBML.parse();

    /** Add Tweet button */
    $('#outtro').append($('<a>').attr('href',"https://twitter.com/share")
                                .attr('data-lang',"en")
                                .addClass("twitter-share-button")
                                .text("Tweet")
                                .attr('url',"OUR URL"));
    // Render the button
    addTweetButton();

    /** Add Google Plus button */
    // Make sure the metadata is right
    $('html').attr('itemscope',"")
             .attr('itemtype',"http://schema.org/Demo");
    $('head').append($('<meta>').attr('itemprop',"name")
                                .attr('content',"Everything is connected"));
    $('head').append($('<meta>').attr('itemprop',"name")
                                .attr('content',"A demonstrator to show how everything is connected."));

    $('#outtro').append($('<div>').addClass("g-plusone")
                                  .attr('data-size',"medium")
                                  .attr('data-href',"OUR URL"));
    // Render the button
    addGPlusButton();
  }

  function addTweetButton() {
    var js,fjs=document.getElementsByTagName('script')[0];
    if(!document.getElementById('twitter-wjs')) {
      js=document.createElement('script');
      js.id='twitter-wjs';
      js.src="https://platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js,fjs);
    }
  }

  function addGPlusButton() {
    var po = document.createElement('script');
    po.type = 'text/javascript';
    po.async = true;
    po.src = 'https://apis.google.com/js/plusone.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);
  }

  return OuttroductionSlideGenerator;
});