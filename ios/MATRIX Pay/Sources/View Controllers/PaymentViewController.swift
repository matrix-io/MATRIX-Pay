//
//  PaymentViewController.swift
//  MATRIX Pay
//
//  Created by Nikolai Vazquez on 6/10/17.
//  Copyright © 2017 MATRIX Labs. All rights reserved.
//

import UIKit
import SocketIO
import Dispatch

func price(from field: UITextField) -> UInt? {
    guard let text = field.text, let value = Double(text) else {
        return nil
    }
    return UInt(value * 100)
}

class PaymentViewController: UIViewController {

    @IBOutlet weak var priceField: UITextField!

    @IBOutlet weak var securityField: UITextField!

    private var shouldContinue = true

    var price: Int? {
        guard let text = priceField.text, let value = Double(text) else {
            return nil
        }
        return Int(value * 100)
    }

    @IBAction func performPayment() {
        guard shouldContinue, let price = self.price, let sec = securityField.text.flatMap({ Int($0) }) else {
            return
        }
        guard (socket.engine?.connected ?? false) else {
            let alert = UIAlertController(title: "Connection Error",
                                          message: "Not connected to MATRIX. Cannnot perform purchase.",
                                          preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
            self.present(alert, animated: true, completion: nil)
            return
        }

        shouldContinue = false

        socket.emit("PaymentRequest", price, sec)
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        socket.on("PaymentResult") { [weak self] data, _ in
            guard let `self` = self, let success = data.first as? Bool else {
                return
            }

            self.shouldContinue = true

            if success {
                let alert = UIAlertController(title: "Success!",
                                              message: "Payment succeeded. Thank you for using MATRIX Pay. :)",
                                              preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "Awesome", style: .default, handler: nil))
                self.present(alert, animated: true) { _ in
                    DispatchQueue.main.async { [weak self] in
                        self?.navigationController?.popToRootViewController(animated: true)
                    }
                }
            } else {
                let alert = UIAlertController(title: "Verification Error",
                                              message: "Face is not recognized or security code is incorrect.",
                                              preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                self.present(alert, animated: true, completion: nil)
            }
        }
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        shouldContinue = true
    }

}
