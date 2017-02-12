import { expect } from 'chai';
import reducer, { initialState } from './reducer';
import {
  BOOTSTRAP_STATE,
  SET_IS_DRAGGING,
  SET_OPTIONS_PANEL_OPEN,
  SET_SELECTED_INDEX
} from './actionTypes';

describe('reducer', () => {

  it('should update state when BOOTSTRAP_STATE is fired', () => {
    const result = reducer(
      {
        type: BOOTSTRAP_STATE,
        value: {
          ...initialState,
          options: [{ displayText: 'Any', value: 'null' }, { displayText: 'Fiat', value: 'fiat' }],
          selectedValue: 'fiat',
          name: 'thing'
        }
      },
      initialState
    );
    expect(result.name).to.eql('thing');
    expect(result.selectedOption).to.eql({ displayText: 'Fiat', value: 'fiat' });
  });

  it('should update state.isDragging when SET_IS_DRAGGING is fired', () => {
    const result = reducer(
      { type: SET_IS_DRAGGING, value: true },
      initialState
    );

    expect(result).to.eql({
      ...initialState,
      isDragging: true
    });
  });

  it('should update state.isOptionsPanelOpen when SET_OPTIONS_PANEL_OPEN is fired', () => {
    const result = reducer(
      { type: SET_OPTIONS_PANEL_OPEN, value: true },
      initialState
    );

    expect(result).to.eql({
      ...initialState,
      isOptionsPanelOpen: true
    });
  });

  it('should update state.selectedIndex when SET_SELECTED_INDEX is fired', () => {
    const result = reducer(
      { type: SET_SELECTED_INDEX, value: 7 },
      initialState
    );

    expect(result).to.eql({
      ...initialState,
      selectedIndex: 7
    });
  });

});