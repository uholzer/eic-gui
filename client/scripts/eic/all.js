(function (define) {
  "use strict";
  var all = [
    './CombinedSlideGenerator',
    './GoogleImageSlideGenerator',
    './SlidePresenter',
    './TitleSlideGenerator',
  ];
  define(all, function () {
    var eic = {};
    for (var i = 0; i < all.length; i++)
      eic[all[i].substr(2)] = arguments[i];
    return eic;
  });
})(define);
