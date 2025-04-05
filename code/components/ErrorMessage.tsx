import { Text } from 'react-native';

type ErrorMessageProps = {
    message: string
}
const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {


    return (
        <>
            <Text>{message}</Text>
        </>
    )
}

export default ErrorMessage;