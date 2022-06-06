import * as React from 'react';
import axios from 'axios';

interface Event {
  date: string;
  location: string;
  eventTitle: string;
  eventDescription: string[];
}

interface State {
  events: Event[];
  loaded: boolean;
}

class App extends React.Component<{}, State> {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      loaded: false,
    };
  }

  loadCalendar = async () => {
    // TODO: env var
    const res = await axios.get<any>(
      'https://asia-east2-thermal-highway-147704.cloudfunctions.net/bridgeLights'
    );
    console.log(res.data.events);
    this.setState({
      events: res.data.events,
      loaded: true,
    });
  };

  componentDidMount() {
    this.loadCalendar();
  }

  render() {
    return (
      <div className="container content is-family-sans-serif">
        {this.state.loaded &&
          this.state.events.map((event, idx) => {
            const containerClassName = idx === 0 ? 'hero is-info' : 'hero';
            const bodyClassName = idx === 0 ? 'hero-body' : 'hero-body';
            return (
              <section className={containerClassName}>
                <div className={bodyClassName}>
                  <div className="container">
                    <h3 className="subtitle">{event.date}</h3>
                    <h1 className="title">{event.eventTitle}</h1>
                    <div>
                      {event.eventDescription.map((desc, idx) => (
                        <p key={idx}>{desc}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
      </div>
    );
  }
}

export default App;
