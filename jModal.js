(function (window, console, document, $) {
    'use strict';

    if ($.fn.jModal) {
        return console.log('jModal already included');
    }

    /**
     *
     * @param jElement {Object}
     * @param actions {Object}
     * @constructor
     */

    var Modal = function Modal(jElement, actions) {
        var bPassedOptions = actions && !$.isEmptyObject(actions),
            sClose;

        this.hParam = bPassedOptions ? $.extend({}, $.fn.jModal.defaults, actions) : $.fn.jModal.defaults;

        sClose = typeof this.hParam.closeText === 'string' ? this.hParam.closeText : $.fn.jModal.defaults.closeText;

        this.hElements = {
            jElement: jElement,
            jDocument: $(document),
            jBody: $('body'),
            jModal: $(this.hParam.modal).addClass(this.hParam.classes.modal),
            jClose: $(this.hParam.close).addClass(this.hParam.classes.close).text(sClose)
        };

        this.hElements.jContent = this.hElements.jModal.children();

        this.bOpen = false;

        this._initialize();
        this._attachEvents();
    };

    $.extend(Modal.prototype, {
        _initialize: function _initialize() {
            if (!this.hParam.ajax) {
                this.set(this.hParam.html);
            }

            return this;
        },

        set: function append(html) {
            this.hElements.jContent
                .addClass(this.hParam.classes.inner)
                .html(this.hParam.prepare(html))
                .append(this.hElements.jClose);

            // TODO: move it to attachEvents method
            this.hElements.jClose.on(this.hParam.events.close + '.jmodal', $.proxy(this.closeModal, this));

            return this.hElements.jElement;
        },

        _attachEvents: function _attachEvents() {
            this.hElements.jElement.on(this.hParam.events.open + '.jmodal', $.proxy(this.openModal, this));
            this.hElements.jDocument.on('keyup.jmodal', $.proxy(this._keyClose, this));
            this.hElements.jModal.on(this.hParam.events.close + '.jmodal', $.proxy(this.closeModal, this));
            this.hElements.jContent.on(this.hParam.events.close + '.jmodal', function(event) {
                event.stopPropagation();
            });
        },

        openModal: function openModal(event) {
            var _this = this;

            if (event) {
                event.preventDefault();
            }

            // TODO: wait for any async function
            if (_this.hParam.ajax) {
                $.ajax($.extend({}, _this.hParam.ajaxSettings, _this.hParam.ajax, {
                    success: function(data) {
                        _this.set(data);
                        _this._showModal();

                        if (_this.hParam.ajax.success) {
                            _this.hParam.ajax.success.apply(this, arguments);
                        }
                    }
                }));

            } else if (_this.hParam.promise && _this.hParam.promise.done) {
                _this.hParam.promise.done(function(data) {
                    _this.set(data);
                    _this._showModal();

                    return this;
                });

            } else {
                _this._showModal();
            }

            return this.hElements.jElement;
        },

        _showModal: function _showModal() {
            this.hElements.jBody.append(this.hElements.jModal);
            this.bOpen = true;

            this.hParam.onOpen(this);
        },

        closeModal: function closeModal(event) {
            if (event) {
                event.preventDefault();
            }

            if (this.bOpen) {
                this.hElements.jModal.detach();
                this.bOpen = false;

                this.hParam.onClose(this);
            }

            return this.hElements.jElement;
        },

        // Handle 'esc' key
        _keyClose: function _keyClose(event) {
            if (event && event.keyCode === 27) {
                this.closeModal();
            }
        },

        destroy: function destroy() {
            this.hElements.jElement.off('.jmodal').data('jModal', null);
            this.hElements.jModal.remove();
        }
    });

    $.fn.jModal = function (action, params) {
        var args = arguments;

        return this.each(function () {
            var jModal = $(this);

            if (!$.data(this, 'jModal')) {
                $.data(this, 'jModal', new Modal(jModal, action));

            } else {

                if (args.length) {
                    if (typeof jModal.data('jModal')[action] === 'function') {
                        // TODO: extend to getters
                        jModal.data('jModal')[action](params);
                    } else {
                        $.error('No such method in jModal plugin')
                    }
                }

                return jModal;
            }

            return this;
        });
    };

    $.fn.jModal.defaults = {
        classes: {
            modal: 'g-modal',
            inner: 'g-modal__inner',
            close: 'g-modal__inner__close'
        },
        events: {
            open: 'click',
            close: 'click'
        },
        modal: '<div><div></div></div>',
        close: '<a href="#"/>',
        closeText: 'Close',
        beforeSet: $.noop,
        prepare: function(html) {
            return html;
        },
        onOpen: $.noop,
        onClose: $.noop,
        ajaxSettings: {
            cache: false
        }
    };

    $.fn.jModal.setDefaults = function(hDefaults) {
        $.extend($.fn.jModal.defaults, hDefaults);
    };

})(window, window.console, document, window.jQuery);