## jModal
Simple jQuery modal plugin

Designed to unify and simplify modals.

## Usage
# Include jModal after jQuery.

    <script src="jquery-2.1.3.js"></script>
    <script src="jModal.js"></script>

# Add styles for modal (example presented)
# Use it!

    // Simple usage
    $('.open-modal').jModal({
      html: '<p>My Custom Html</p>'
    });

    // Async usage
    $('.open-modal').jModal({
    	// Promise method have to return deferred object
        // Or be deferred itself to wait it resolve and pass 'data'
        // Helpful with template-engines or async calls (such $.ajax)
        promise: function() {
        	return $.ajax({
            	url: 'data.json'
            });
        },
        // Deferred resolve 'data' will be passed to 'prepare' method
        prepare: function(data) {
        	// Returned value will be passed to modal content as 'html' field in sync usage
        	return data.html;
        }
    });
	