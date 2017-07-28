//
//  ClientOperation.swift
//  MATRIX Pay
//
//  Created by Nikolai Vazquez on 6/11/17.
//  Copyright © 2017 MATRIX Labs. All rights reserved.
//

import Foundation
import SocketIO

enum ClientOperation: String {

    case register = "Register"

    case payment = "Payment"

    var request: String {
        return rawValue + "Request"
    }

    var result: String {
        return rawValue + "Result"
    }

    var cancel: String {
        return rawValue + "Cancel"
    }

}

extension SocketIOClient {

    @discardableResult
    func on(resultOf operation: ClientOperation, callback: @escaping NormalCallback) -> UUID {
        return on(operation.result, callback: callback)
    }

    @discardableResult
    func once(resultOf operation: ClientOperation, callback: @escaping NormalCallback) -> UUID {
        return once(operation.result, callback: callback)
    }

    func off(resultOf operation: ClientOperation) {
        off(operation.result)
    }

    func emit(requestFor operation: ClientOperation, _ items: SocketData...) {
        typealias T = (String, SocketData...) -> ()
        typealias U = (String, [SocketData]) -> ()
        unsafeBitCast(self.emit as T, to: U.self)(operation.request, items)
    }

    func emit(cancelFor operation: ClientOperation) {
        emit(operation.cancel)
    }

}
