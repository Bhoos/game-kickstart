import { Jut } from '@bhoos/jut-engine';
import { RoomViewerProps } from '@bhoos/super-app-interface';
import { DisplayConfigText, LabelContainer, SuperRadio, formatConfigTimer } from '@bhoos/super-components';
import { View } from 'react-native';

export function JutRoomViewer({ room, prefs, updatePrefs }: RoomViewerProps<Jut>) {
  return (
    <View>
      <DisplayConfigText label="Number of Deck" sublabel="A deck is set of 52 cards" value={room.config.books} />
      <DisplayConfigText
        label="Cards Per Player"
        sublabel="No. of cards each player recieves"
        value={room.config.cardsPerPlayer}
      />
      <DisplayConfigText
        label="Play Interval"
        sublabel="Time allowed for throwing a card"
        value={formatConfigTimer(room.config.playTimer)}
      />
      <DisplayConfigText
        label="Pick Interval"
        sublabel="Time allowed for picking a card"
        value={formatConfigTimer(room.config.pickTimer)}
      />
      <DisplayConfigText
        label="Submit Interval"
        sublabel="Time allowed for submitting the game"
        value={formatConfigTimer(room.config.submitTimer)}
      />
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
    </View>
  );
}
