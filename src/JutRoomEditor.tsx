import React from 'react';
import { IntegerValidator, StateController, StringValidator, useStateController } from '@bhoos/react-kit-form';
import { FormTextInputLabel, LabelContainer, SuperRadio, SuperRadioForm } from '@bhoos/super-components';
import { RoomConfig, RoomEditorProps } from '@bhoos/super-app-interface';
import { Jut } from '@bhoos/jut-engine';
import { RadioValidator } from '@bhoos/super-components';

function validateTimer(interval: number) {
  if (interval === -1) return -1;
  if (interval < 1000) throw new Error('Interval is too low. Must be greater than 1000ms');
  if (interval > 6000) throw new Error('Interval is too high. Must be less than 6000ms');
  return interval;
}

const bookOptions = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
];

const cardsPerPlayerOptions = [
  { label: '7', value: 7 },
  { label: '9', value: 9 },
];

const FormStructure = {
  config: {
    books: new RadioValidator(bookOptions),
    cardsPerPlayer: new RadioValidator(cardsPerPlayerOptions),
    pickTimer: new IntegerValidator().max(100),
    playTimer: new IntegerValidator().custom(validateTimer),
    submitTimer: new IntegerValidator().custom(validateTimer),
  },
};

if (__DEV__) {
  cardsPerPlayerOptions.push({ label: '1', value: 1 });
}

export function JutRoomEditor({ roomCopy, setRoomController, prefs, updatePrefs }: RoomEditorProps<Jut>) {
  const ctlr = useStateController(() => {
    const ctlr = new StateController<typeof FormStructure, RoomConfig<Jut>>(FormStructure, roomCopy);
    setRoomController(ctlr);
    return ctlr;
  });
  const config = ctlr.substate('config');
  const books = config.field('books');
  const cardsPerPlayer = config.field('cardsPerPlayer');

  return (
    <>
      <LabelContainer label="Number of Deck" sublabel="A deck is set of 52 cards">
        <SuperRadioForm controller={books} />
      </LabelContainer>
      <LabelContainer label="Cards Per Player">
        <SuperRadioForm controller={cardsPerPlayer} />
      </LabelContainer>
      <LabelContainer label="Show Opponent Cards">
        <SuperRadio
          options={[
            { label: 'No', value: 'hidden' },
            { label: 'Yes', value: 'fan' },
          ]}
          value={prefs.cardsLayout}
          onChange={val => {
            updatePrefs({ cardsLayout: val });
          }}
        />
      </LabelContainer>
      {__DEV__ && <FormTextInputLabel inputMode="numeric" label="Pick Timer" controller={config.field('pickTimer')} />}
      {__DEV__ && <FormTextInputLabel inputMode="numeric" label="Play Timer" controller={config.field('playTimer')} />}
    </>
  );
}
