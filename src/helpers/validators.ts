import { body, check, param } from 'express-validator'
import { UserTransaction } from '../models/UserTransaction';
import { MY_PAIRS, VALID_OPERATION_TYPES } from './constants';

export function standardValidation() {
    return [ 
        check('pair', 'pair is mandatory').exists(),
        check('pair', `pair must be one of ${MY_PAIRS}`).isIn(MY_PAIRS),
        check('amount', 'amount is mandatory').exists(),
        check('amount', 'amount must be a number').isFloat(),
        check('operationType', 'operationType is mandatory').exists(),
        check('operationType', `operationType must be one of ${VALID_OPERATION_TYPES}`).isIn(VALID_OPERATION_TYPES),
    ]   
}

export function transactionMandatoryInParamsValidation() {
    return [ 
        param('id', 'id is mandatory').exists(),
    ]
}

export function transactionMandatoryInBodyValidation() {
    return [ 
        body('transactionId', 'transactionId is mandatory').exists(),
    ]
}

export function transactionFieldsValidation(
    transaction: UserTransaction, 
    inputFields: {amount: number, pair: string, operationType: string}
    ) {

    if (!transaction) 
        throw new Error("Price expired!")
    if (transaction.getAmount() != inputFields.amount) 
        throw new Error("'amount' does not match with transaction amount!")
    if (transaction.getPair() !== inputFields.pair) 
        throw new Error("'pair' does not match with transaction pair!")
    if (transaction.getOperationType() !== inputFields.operationType) 
        throw new Error("'operation' does not match with transaction 'operation'!")
}
