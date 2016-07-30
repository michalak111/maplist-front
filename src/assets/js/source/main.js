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
})(jQuery, window, document);
