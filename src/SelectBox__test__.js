import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';
import jsdom from 'jsdom';

import SelectBox from './SelectBox';
import * as actionTypes from './actionTypes';

const submitSpy = sinon.spy();

const initialProps = {
  prefix: 'Make',
  name: 'make',
  selectedValue: 'fiat',
  onSubmit: submitSpy,
  options: [
    { displayText: 'Any', value: 'null' },
    { displayText: 'Fiat', value: 'fiat' },
    { displayText: 'Subaru', value: 'subaru' },
    { displayText: 'BMW', value: 'bmw' },
    { displayText: 'Tesla', value: 'tesla' }
  ]
};

const setup = ((overrideProps, customProps = undefined) => {
  const props = customProps || {
    ...initialProps,
    ...overrideProps
  };
  return mount(<SelectBox {...props}/>);
});

describe('SelectBox', () => {

  describe('Initialise', () => {

    let selectBox;
    let selectBoxInstance;

    beforeEach(() => {
      selectBox = setup();
      selectBoxInstance = selectBox.instance();
    });

    it('should render correct amount of options and have an onSubmit function', () => {
      expect(selectBox.find('.options-container .option').length).to.equal(5);
      expect(selectBox.find('SelectBox').props().onSubmit).to.equal(submitSpy);
    });

    it('should setup state', () => {
      const expectedState = {
        isDragging: false,
        isOptionsPanelOpen: false,
        selectedIndex: 1,
        name: 'make',
        options: [
          { displayText: 'Any', value: 'null' },
          { displayText: 'Fiat', value: 'fiat' },
          { displayText: 'Subaru', value: 'subaru' },
          { displayText: 'BMW', value: 'bmw' },
          { displayText: 'Tesla', value: 'tesla' }
        ],
        selectedOption: {
          displayText: 'Fiat',
          value: 'fiat'
        }
      };

      expect(selectBox.state()).to.eql( expectedState );
    });

    it('should setup mousedown, keyup and blur on desktop', () => {
      const listenerKeys = Object.keys(selectBoxInstance.listeners).map(k => k);
      expect(listenerKeys).to.eql(['onBlur', 'onMouseDown', 'onKeyDown']);
    });

    it('should setup touchmove, touchstart, touchend and blur on a touch device', () => {
      jsdom.env({
        html: '<html></html>',
        done: function (error, window) {
          window['ontouchstart'] = 'fakeEvent';

          const selectBoxMobile = setup();
          const selectBoxInstanceMobile = selectBoxMobile.instance();

          const listenerKeys = Object.keys(selectBoxInstanceMobile.listeners).map(k => k);
          expect(listenerKeys).to.eql(['onBlur', 'onTouchMove', 'onTouchStart', 'onTouchEnd']);

          window.close();
        }
      });
    });

    afterEach(() => {
      selectBox.unmount();
    });

  });

  describe('Events', () => {

    let selectBox;
    let selectBoxContainer;
    let selectBoxDOM;

    beforeEach(() => {
      selectBox = setup();
      selectBoxContainer = selectBox.find('.select-box');
      selectBoxDOM = selectBoxContainer.getDOMNode();
    });

    it('mousedown on select-box container should toggle the options panel open and closed', () => {
      // Open
      selectBoxContainer.simulate('mousedown');
      expect(selectBoxContainer.hasClass('options-container-visible')).to.equal(true);
      expect(selectBox.state('isOptionsPanelOpen')).to.equal(true);

      // Closed
      selectBoxContainer.simulate('mousedown');
      expect(selectBoxContainer.hasClass('options-container-visible')).to.equal(false);
      expect(selectBox.state('isOptionsPanelOpen')).to.equal(false);

      // Open
      selectBoxContainer.simulate('mousedown');
      expect(selectBoxContainer.hasClass('options-container-visible')).to.equal(true);
      expect(selectBox.state('isOptionsPanelOpen')).to.equal(true);
    });

    it('mousedown on option should update state with correct option index', () => {
      const selectBoxInstance = selectBox.instance();
      const updateStateSpy = sinon.spy(selectBoxInstance, 'updateState');
      selectBoxContainer.find('[data-key=3]').simulate('mousedown');
      expect(updateStateSpy.args[0][0]).to.eql({ type: actionTypes.SET_SELECTED_INDEX, value: 3 });
      selectBoxInstance.updateState.restore();
    });

    it('blur on select-box container should close the options panel', () => {

      expect(selectBoxContainer.hasClass('options-container-visible')).to.equal(false);
      expect(selectBox.state('isOptionsPanelOpen')).to.equal(false);

      selectBoxDOM.focus();

      // Close
      selectBoxContainer.simulate('blur');
      expect(selectBoxContainer.hasClass('options-container-visible')).to.equal(false);
      expect(selectBox.state('isOptionsPanelOpen')).to.equal(false);
    });

    afterEach(() => {
      selectBox.unmount();
    });

  });

  describe('SelectBox functions', () => {

    let selectBox;
    let selectBoxInstance;
    let selectBoxContainer;

    let updateStateSpy;
    let enterPressedSpy;
    let toggleOptionsPanelSpy;
    let keyUpOrDownPressedSpy;

    beforeEach(() => {
      selectBox = setup();
      selectBoxInstance = selectBox.instance();
      selectBoxContainer = selectBox.find('.select-box');

      updateStateSpy = sinon.spy(selectBoxInstance, 'updateState');
      enterPressedSpy = sinon.spy(selectBoxInstance, 'enterPressed');
      toggleOptionsPanelSpy = sinon.spy(selectBoxInstance, 'toggleOptionsPanel');
      keyUpOrDownPressedSpy = sinon.spy(selectBoxInstance, 'keyUpOrDownPressed');
    });

    it('toggleOptionsPanel("open") should set isOptionsPanelOpen to true', () => {
      selectBoxInstance.toggleOptionsPanel('open');
      expect(updateStateSpy.args[0]).to.eql([{ type: actionTypes.SET_OPTIONS_PANEL_OPEN, value: true }]);
    });

    it('toggleOptionsPanel("close") should set isOptionsPanelOpen to false', () => {
      selectBoxInstance.toggleOptionsPanel('close');
      expect(updateStateSpy.args[0]).to.eql([{ type: actionTypes.SET_OPTIONS_PANEL_OPEN, value: false }]);
    });

    it('toggleOptionsPanel() should toggle isOptionsPanelOpen true and false', () => {
      selectBoxInstance.toggleOptionsPanel();
      expect(updateStateSpy.args[0]).to.eql([{ type: actionTypes.SET_OPTIONS_PANEL_OPEN, value: true }]);

      selectBoxInstance.toggleOptionsPanel();
      expect(updateStateSpy.args[1]).to.eql([{ type: actionTypes.SET_OPTIONS_PANEL_OPEN, value: false }]);

      selectBoxInstance.toggleOptionsPanel();
      expect(updateStateSpy.args[0]).to.eql([{ type: actionTypes.SET_OPTIONS_PANEL_OPEN, value: true }]);
    });

    it('handleTouchStart() should set isDragging to false', () => {
      selectBoxInstance.handleTouchStart();
      expect(updateStateSpy.args[0]).to.eql([{ type: actionTypes.SET_IS_DRAGGING, value: false }]);
      updateStateSpy.reset();
    });

    it('handleTouchMove() should set isDragging to true', () => {
      selectBoxInstance.handleTouchMove();
      expect(updateStateSpy.args[0]).to.eql([{ type: actionTypes.SET_IS_DRAGGING, value: true }]);
      updateStateSpy.reset();
    });

    it('Enter key calls handleSelectBoxKeyEvent() enterPressed()', () => {
      selectBoxContainer.simulate('keyDown', { keyCode: 13 });
      expect(enterPressedSpy.called).to.equal(true);
    });

    it('handleSelectBoxKeyEvent() - keyDown "ENTER" calls enterPressed() and onSubmit() when options panel closed', () => {
      submitSpy.reset();

      selectBoxContainer.simulate('keyDown', { keyCode: 13 });
      expect(enterPressedSpy.called).to.equal(true);
      expect(submitSpy.called).to.equal(true);
      expect(enterPressedSpy.args[0][0].defaultPrevented).to.equal(true);
    });

    it('handleSelectBoxKeyEvent() - keyDown "ENTER" calls enterPressed() and toggleOptionsPanel("close") when options panel open', () => {
      submitSpy.reset();

      selectBoxContainer.simulate('mouseDown'); // open
      selectBoxContainer.simulate('keyDown', { keyCode: 13 }); // enter pressed

      expect(enterPressedSpy.called).to.equal(true);
      expect(submitSpy.called).to.equal(false);
      expect(toggleOptionsPanelSpy.secondCall.args[0]).to.equal('close');
      expect(enterPressedSpy.args[0][0].defaultPrevented).to.equal(true);
      expect(enterPressedSpy.args[0][0].isPropagationStopped()).to.equal(true);
    });

    it('handleSelectBoxKeyEvent() - keyDown "SPACE" toggles the options panel open/closed with toggleOptionsPanel()', () => {
      selectBoxContainer.simulate('keyDown', { keyCode: 32 }); // space pressed
      expect(selectBox.state('isOptionsPanelOpen')).to.equal( true );

      selectBoxContainer.simulate('keyDown', { keyCode: 32 }); // space pressed
      expect(selectBox.state('isOptionsPanelOpen')).to.equal( false );
    });

    it('handleSelectBoxKeyEvent() - keyDown "ESCAPE" closes the options panel by blurring it', () => {
      selectBoxContainer.simulate('mouseDown'); // open
      expect(selectBox.state('isOptionsPanelOpen')).to.equal( true );

      // ensure its focussed
      expect(document.activeElement.classList.contains('select-box')).to.equal(true);

      selectBoxContainer.simulate('keyDown', { keyCode: 27 }); // escape pressed
      expect(document.activeElement.classList.contains('select-box')).to.equal(false);
    });

    it('handleSelectBoxKeyEvent() - keyDown "UP" calls enterPressed("decrement")', () => {
      selectBoxContainer.simulate('keyDown', { keyCode: 38 });
      expect(keyUpOrDownPressedSpy.calledOnce).to.equal(true);
      expect(keyUpOrDownPressedSpy.args[0][0]).to.equal('decrement');
    });

    it('handleSelectBoxKeyEvent() - keyDown "UP" opens the options panel when closed', () => {
      selectBoxContainer.simulate('keyDown', { keyCode: 38 });
      selectBox.setState({ isOptionsPanelOpen: false });
      expect(toggleOptionsPanelSpy.calledOnce).to.equal(true);
      expect(toggleOptionsPanelSpy.args[0][0]).to.equal('open');
    });

    it('handleSelectBoxKeyEvent() - keyDown "DOWN" calls enterPressed("increment")', () => {
      selectBoxContainer.simulate('keyDown', { keyCode: 40 });
      expect(keyUpOrDownPressedSpy.calledOnce).to.equal(true);
      expect(keyUpOrDownPressedSpy.args[0][0]).to.equal('increment');
    });

    it('handleSelectBoxKeyEvent() - keyDown "DOWN" opens the options panel when closed', () => {
      selectBoxContainer.simulate('keyDown', { keyCode: 40 });
      selectBox.setState({ isOptionsPanelOpen: false });
      expect(toggleOptionsPanelSpy.calledOnce).to.equal(true);
      expect(toggleOptionsPanelSpy.args[0][0]).to.equal('open');
    });

    it('handleSelectBoxKeyEvent() - keyDown "DOWN" does NOT try to open the options panel when already open', () => {
      selectBox.setState({ isOptionsPanelOpen: true });
      selectBoxContainer.simulate('keyDown', { keyCode: 40 });
      expect(toggleOptionsPanelSpy.calledOnce).to.equal(false);
    });

    it('tapping on selectBox does not close the options panel when a user is dragging - allowing a touch device user to scroll', () => {
      jsdom.env({
        html: '<html></html>',
        done: function (error, window) {
          window['ontouchstart'] = 'fakeEvent';

          const selectBoxMobile = setup();
          const selectBoxMobileContainer = selectBoxMobile.find('.select-box');

          selectBoxMobileContainer.simulate('touchStart');
          expect(toggleOptionsPanelSpy.calledOnce).to.equal(true);

          selectBox.setState({ isDragging: true });
          selectBoxMobileContainer.simulate('touchStart');
          expect(toggleOptionsPanelSpy.calledTwice).to.equal(false);

          window.close();
        }
      });
    });

    afterEach(() => {
      selectBoxInstance.updateState.restore();
      selectBoxInstance.enterPressed.restore();
      selectBoxInstance.toggleOptionsPanel.restore();
      selectBoxInstance.keyUpOrDownPressed.restore();
      selectBox.unmount();
    });

  });


  describe('option list selectedValue .selected class', () => {

    let selectBox;

    it('should add .selected class to option if selectedValue prop found in options', () => {
      selectBox = setup();
      expect(selectBox.find('.options-container .option.selected').props()['children']).to.equal('Fiat');
    });

    it('should add .selected class to first option when unrecognised selectedValue prop', () => {
      selectBox = setup({selectedValue: 'blahblah'});
      expect(selectBox.find('.options-container .option.selected').props().children).to.equal('Any');
    });

    it('should add .selected class to first option when no selectedValue prop', () => {
      const props = {
        prefix: 'Make',
        name: 'make',
        onSubmit: submitSpy,
        options: [{ displayText: 'Any', value: 'null' }, { displayText: 'Fiat', value: 'fiat' }]
      };
      selectBox = setup(undefined, props);
      expect(selectBox.find('.options-container .option.selected').props().children).to.equal('Any');
    });

    afterEach(() => {
      selectBox.unmount();
    });

  });

});