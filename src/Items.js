import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

class Items extends Component {
  state = {
    items: []
  }

  componentDidMount() {
    this.update();
  }

  update() {
    const { db } = this.props;
    db.transaction(tx => {
      tx.executeSql(`select * from items where done = ?;`, [this.props.done ? 1 : 0], (_, { rows: { _array }}) => this.setState({ items: _array }));
    });
  }

  render() {
    const { items } = this.state;

    return (
      <View style={{ margin: 5 }}>
        {items.map(({ id, done, value }) => {
          return (
            <TouchableOpacity
              key={id}
              onPress={() => this.props.onPressItem && this.props.onPressItem(id)}
              style={{ padding: 5, backgroundColor: done ? '#aaffaa' : 'white', borderColor: 'black', borderWidth: 1 }}
            >
            <Text>{value}</Text>
          </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

export default Items;
