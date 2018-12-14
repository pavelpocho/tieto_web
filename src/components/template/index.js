import css from './index.css';

export default class Template extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const appName = ObjectContainer.getHttpCommunicator().getAppName();

        return (
            <p>Hello world, my name is {appName}</p>
        )
        
    }

}