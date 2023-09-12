const _eventHandlers = {}; // somewhere global



function addListener(node, event, handler, capture) {

    if(!(node in _eventHandlers)) {

        // _eventHandlers stores references to nodes

        _eventHandlers[node] = {};

    }

    if(!(event in _eventHandlers[node])) {

        // each entry contains another entry for each event type

        _eventHandlers[node][event] = [];

    }

    // capture reference

    _eventHandlers[node][event].push([handler, capture]);

    node.addEventListener(event, handler, capture);

 }



function removeAllListeners(node, event) {

    if(node in _eventHandlers) {

        const handlers = _eventHandlers[node];

        if(event in handlers) {

            const eventHandlers = handlers[event];

            for(let i = eventHandlers.length; i--;) {

                const handler = eventHandlers[i];

                node.removeEventListener(event, handler[0], handler[1]);

            }

        }

    }

}