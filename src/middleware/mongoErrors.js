'use strict'

/**
 * Get unique error field name
 */
const uniqueMessage = error => {
    let output
    try {
        let fieldName = error.message.substring(
            error.message.lastIndexOf('.$') + 2,
            error.message.lastIndexOf('_1')
        )
        output =
            fieldName.charAt(0).toUpperCase() +
            fieldName.slice(1) +
            ' already exists'
    } catch (ex) {
        output = 'Unique field already exists'
    }
    return output
}

/**
 * Get the error message from error object
 */
const mongoError = err => {
    let message
    if (err.code) {
        switch (error.code) {
            case 11000:
            case 11001:
                message = uniqueMessage(err)
                break
            default:
                message = 'Something went wrong'
        }
    } else if (err.errors) {
        for (let errorName in err.errors) {
            if (err.errors[errorName].message) {
                message = err.errors[errorName].message
            }
        }
    }

    return message
}

export default mongoError
