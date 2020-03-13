import EventEmitter from 'events';

export class Dragg {
	constructor($elem, props) {
		this.$elem = $elem
		this.props = props || []

		this.dragStart = this.dragStart.bind(this)
		this.dragStop = this.dragStop.bind(this)
		this.dragMove = this.dragMove.bind(this)

		this.$elementUnder = null

		this.emitter = new EventEmitter()

		this.classes = this.props.classes || []
		this.restrictTo = this.props.restrictTo

		this.latestValidEvent = null
		
		this.$elem.addEventListener('mousedown', this.dragStart)
		this.$elem.addEventListener('touchstart', this.dragStart)
	}

	dragStart(event) {
		event.preventDefault()

		const {x, y} = this.getCoordinates(event)
		
		this.dragging = true

		window.addEventListener('mouseup', this.dragStop)
		window.addEventListener('touchend', this.dragStop)
		window.addEventListener('mousemove', this.dragMove)
		window.addEventListener('touchmove', this.dragMove)

		this.$elem.classList.add(this.classes['dragging'])
		this.setPosition(x, y)

		const $elemBelow = this.getElementBelow(x, y)
		this.emitter.emit('start', $elemBelow)
	}

	dragMove(event) {
		const {x, y} = this.getCoordinates(event)
		
		if ( !this.isInsideRestrictedZone(x, y) ) {
			this.emitter.emit('outside')
			this.$elementUnder = null
			return
		}

		this.emitter.emit('move', event)

		const $elemBelow = this.getElementBelow(x, y)
		
		this.setPosition(x, y)

		if ( this.$elementUnder && (this.$elementUnder === $elemBelow) ) {
			// same element: no need to fire a 'change' event
			return
		}

		this.$elementUnder = $elemBelow
		this.emitter.emit('change', $elemBelow)
	}

	dragStop(event) {
		const {x, y} = this.getCoordinates(event)

		if ( this.dragging ) {
			this.dragging = false
			
			window.removeEventListener('mouseup', this.dragStop)
			window.removeEventListener('touchend', this.dragStop)
			window.removeEventListener('mousemove', this.dragMove)
			window.removeEventListener('touchmove', this.dragMove)

			this.$elem.classList.remove(this.classes['dragging'])
			this.setPosition('', '')

			const $elemBelow = this.getElementBelow(x, y)
			this.emitter.emit('drop', $elemBelow)
		}
	}

	isInsideRestrictedZone(x, y) {
		if ( !this.restrictTo ) return true
		const restrictToElems = this.restrictTo()
		for ( const zoneElem of restrictToElems ) {
			const rect = zoneElem.getBoundingClientRect()
			if ( !(
				x > (rect.left) && 
				x < (rect.right) &&
				y > (rect.top) &&
				y < (rect.bottom) ) ) {
				return false
			}
		}
		return true
	}

	getCoordinates(event) {
		if ( ['touchmove', 'touchstart', 'touchend'].indexOf(event.type) !== -1 ) {
			// touch event
			let latestValidEvent = event
			if ( event.touches && event.touches[0] ) {
				// save last touch event because 'touchend' doesn't include a position(?)
				this.latestValidEvent = event
			} else {
				latestValidEvent = this.latestValidEvent
			}
			return {x: latestValidEvent.touches[0].pageX, y: latestValidEvent.touches[0].pageY}
		} else {
			return { x: event.clientX, y: event.clientY }
		}
	}

	getElementBelow(x, y) {
		return document.elementFromPoint(x, y);
	}

	setPosition(x, y) {
		this.$elem.style.left = `${x}px`
		this.$elem.style.top = `${y}px`
	}

	on(event, handler) {
	    this.emitter.on(event, handler);
	}
}

export default Dragg