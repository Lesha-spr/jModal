(function (window, console, document, $) {
	'use strict';

	if ($.fn.jModal) {
		return console.log('jModal already included');
	}

	/**
	 *
	 * @param element
	 * @param options
	 * @constructor
	 */

	var Modal = function Modal(element, options) {
		var bPassedOptions = options && !$.isEmptyObject(options),
			sClose;

		this.hParam = bPassedOptions ? $.extend({}, $.fn.jModal.defaults, options) : $.fn.jModal.defaults;

		sClose = typeof this.hParam.closeText === 'string' ? this.hParam.closeText : $.fn.jModal.defaults.closeText;

		this.hElements = {
			jElement: $(element),
			jDocument: $(document),
			jBody: $('body'),
			jModal: $(this.hParam.modal).addClass(this.hParam.classes.modal),
			jClose: $(this.hParam.close).addClass(this.hParam.classes.close).text(sClose)
		};

		this.hElements.jContent = this.hElements.jModal.children();

		this.bOpen = false;

		this.initialize();
		this.attachEvents();
	};

	$.extend(Modal.prototype, {
		initialize: function initialize() {
			if (!this.hParam.ajax) {
				this.set(this.hParam.html);
			}
		},

		set: function append(html) {
			this.hElements.jContent
				.addClass(this.hParam.classes.inner)
				.html(this.hParam.prepare(html))
				.append(this.hElements.jClose);
		},

		onErrorTransport: function onErrorTransport() {
			console.log('Get error while transporting modal html');
		},

		attachEvents: function attachEvents() {
			this.hElements.jElement.on(this.hParam.events.open, $.proxy(this.openModal, this));
			this.hElements.jModal.add(this.hElements.jClose)
				.on(this.hParam.events.close, $.proxy(this.closeModal, this));
			this.hElements.jDocument.on('keyup', $.proxy(this.keyClose, this));
			this.hElements.jContent.on(this.hParam.event, function(event) {
				event.stopPropagation();
			});
		},

		openModal: function openModal(event) {
			var _this = this;

			if (event) {
				event.preventDefault();
			}

			if (_this.hParam.ajax) {
				$.ajax($.extend({}, _this.hParam.ajaxSettings, _this.hParam.ajax, {
					success: function(data) {
						_this.set(data);
						_this.showModal(data);

						_this.hParam.ajax.success(data);
					},
					error: function(jqXHR, textStatus, errorThrown) {
						_this.onErrorTransport(jqXHR, textStatus, errorThrown);
						_this.hParam.ajax.error(jqXHR, textStatus, errorThrown);
					}
				}));
			} else {
				_this.showModal();
			}
		},

		showModal: function showModal() {
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
		},

		// Handle 'esc' key
		keyClose: function keyClose(event) {
			if (event && event.keyCode === 27) {
				this.closeModal();
			}
		}
	});

	$.fn.jModal = function (option, args) {
		return this.each(function () {
			if (!$.data(this, 'jModal')) {
				$.data(this, 'jModal', new Modal(this, option));
			} else {
				if ($(this).data('jModal')[option]) {
					$(this).data('jModal')[option](args);
				} else {
					$.error('No such method in jModal plugin')
				}
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