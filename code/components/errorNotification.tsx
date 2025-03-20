import { Text } from 'react-native';

type ErrorNotificationProps = {
    message: string
}
const ErrorNotification: React.FC<ErrorNotificationProps> = ({ message }) => {


    return (
        <>
            <Text>{message}</Text>
        </>
    )
}

export default ErrorNotification;