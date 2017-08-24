//
//  NSNumber+MP.swift
//  MATRIX Pay
//
//  Created by Nikolai Vazquez on 8/3/17.
//  Copyright © 2017 MATRIX Labs. All rights reserved.
//

import Foundation

private let _currencyFormatter: NumberFormatter = {
    let result = NumberFormatter()
    result.numberStyle = .currency
    return result
}()

extension NSNumber {

    var currencyString: String? {
        return _currencyFormatter.string(from: self)
    }

}

extension NSDecimalNumber {

    static let hundred = NSDecimalNumber(value: 100)

}
