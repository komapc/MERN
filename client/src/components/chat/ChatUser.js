import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import React from "react";
import { getChatMessages } from "../../actions/chatActions";
import { sendMessage } from "../../actions/notifications"
class ChatUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      messages: {},
      partner_id: this.props.match.params.id,
    };
    console.log(`partner: ${this.state.partner_id}`);
    getChatMessages(this.props.auth.user.id, this.state.partner_id)
    .then(res => {
      console.log(res.data);
      this.setState({ messages: res.data, loading: false });
    })
    .catch(error=>{
      console.error(error);
    })
  }
  componentDidMount() {
  
  };
  sendMessageWithCallback(sender, receiver, message) {
    sendMessage(sender, receiver, message)
      .then(res => { // Callback
        console.log(JSON.stringify(res));
      });
  }

  render() {
    return <span>
      Chat with a user
      {this.state.messages.name2}
        {/* {this.state.messages.map(message =>
          <div key={message.id}>
           <div>{JSON.stringify(message)}</div>
          </div>
        )} */}
        <div>
          <input type="text" id="message" placeholder="Message"></input>
          <button onClick={() => this.sendMessageWithCallback(
            this.props.auth.user.id,
            this.state.id,
            document.getElementById("message").value
          )}>Send</button>
        </div>
  </span>
};

}

const mapStateToProps = state => ({
        auth: state.auth
});

export default connect(
  mapStateToProps,
)(withRouter(ChatUser));