//
//  PaymentSegue.swift
//  MATRIX Pay
//
//  Created by Nikolai Vazquez on 6/10/17.
//  Copyright © 2017 MATRIX Labs. All rights reserved.
//

import UIKit

class PaymentSegue: UIStoryboardSegue {

    override func perform() {
        guard
            let payInfoViewController = source as? PayInfoViewController,
            let registerViewController = payInfoViewController.parent?.parent else {
                return
        }

        registerViewController.navigationController?.pushViewController(destination, animated: true)
    }

}
