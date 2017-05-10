import React, { Component } from 'react';
import { SQLite } from 'expo';
import { View, TextInput } from 'react-native';
import Items from './Items';

const db = SQLite.openDatabase({ name: 'app.db' });

class App extends Component {
  state = {
    text: ''
  }

  componentDidMount() {
    db.transaction(tx => {
      tx.executeSql(
        'create table if not exists items (id integer primary key not null, done int, value text);'
      );
    });
  }

  add(text) {
    db.transaction(
      tx => {
        tx.executeSql('insert into items (done, value) values (0, ?)', [text]);
        tx.executeSql('select * from items', [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        );
      },
      null,
      this.update
    );
  }

  update = () => {
    this.todo && this.todo.update();
    this.done && this.done.update();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row' }}>
          <TextInput
            style={{ flex: 1, padding: 5, height: 40, borderColor: 'gray', borderWidth: 1 }}
            placeholder="Enter an item"
            value={this.state.text}
            onChangeText={(text) => this.setState({ text })}
            onSubmitEditing={() => {
              this.add(this.state.text); // add this later
              this.setState({ text: '' });
            }}
          />
        </View>

        <View style={{ flex: 1, backgroundColor: 'gray' }}>
          <Items
            db={db}
            done={false}
            ref={(todo) => this.todo = todo}
            onPressItem={(id) => {
              db.transaction(tx => {
                tx.executeSql(`update items set done = 1 where id = ?;`, [id]);
              }, null, this.update);
            }} />

            <Items
              db={db}
              done={true}
              ref={(done) => this.done = done}
              onPressItem={(id) => {
                db.transaction(tx => {
                  tx.executeSql(`delete from items where id = ?;`, [id]);
                }, null, this.update);
              }} />
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
}

export default App;
