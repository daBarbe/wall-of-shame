var ACCESS_TOKEN = '';

var Member = React.createClass({
  loadPrFromServer: function() {
    $.ajax({
      url: 'https://api.github.com/search/issues?access_token='+ACCESS_TOKEN+'&q=repo:adespresso/adespresso type:pr assignee:'+this.props.author+' is:open',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadPrFromServer();
    //setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },

  render: function() {
    return (
      <div>
        <h2>
          <img src={this.props.avatar} width="100px"/> {this.props.author} ({this.state.data.total_count})
        </h2>
        <PullRequestList data={this.state.data} />
      </div>
    );
  }
});

var PullRequest = React.createClass({
  loadData: function() {
    $.ajax({
      url: this.props.url+'?access_token='+ACCESS_TOKEN,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadData();
    //setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    var color = 'black';
    switch (this.state.data.mergeable_state) {
      case 'clean':
        color = 'green';
        break;
      case 'dirty':
        color = 'red';
        break;
      case 'unstable':
        color = 'orange';
        break;
    }
    return (
        <div>
          <h2 style={{color: color}}>#{this.props.number} {this.state.data.mergeable_state}</h2>
        </div>
    );
  }
});


var WallBox = React.createClass({
  loadMembersFromServer: function() {
    $.ajax({
      url: 'https://api.github.com/orgs/adespresso/members?access_token='+ACCESS_TOKEN,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadMembersFromServer();
    setInterval(this.loadMembersFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="wallBox">
        <h1>Wall of Shame</h1>
        <MembersList data={this.state.data} />
      </div>
    );
  }
});

var MembersList = React.createClass({
  render: function() {
    var whitelist = ['daBarbe', 'maxcanna'];

    var memberNodes = this.props.data.filter(function(member) {
      return whitelist.indexOf(member.login) > -1;
    }).map(function(member) {
      return (
        <Member author={member.login} avatar={member.avatar_url} key={member.id}>
        </Member>
      );
    });
    return (
      <div className="membersList">
        {memberNodes}
      </div>
    );
  }
});

var PullRequestList = React.createClass({
  render: function() {
    if (!this.props.data.items) {
      return null;
    }
    var prNodes = this.props.data.items.map(function(pr) {
      return (
          <PullRequest number={pr.number} url={pr.pull_request.url} key={pr.id}></PullRequest>
      );
    });
    return (
        <div className="pullRequestsList">
          {prNodes}
        </div>
    );
  }
});


ReactDOM.render(
  <WallBox pollInterval={60 * 1000} />,
  document.getElementById('content')
);
