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
import Pastel

class PaymentViewController: UIViewController, ItemTableViewControllerDelegate {

    @IBOutlet var itemTableVC: ItemTableViewController!

    @IBOutlet weak var priceField: UITextField!

    @IBOutlet weak var securityField: UITextField!

    @IBOutlet var colorView: PastelView!

    private var price: NSDecimalNumber = 0

    private var shouldContinue = true

    @IBAction func performPayment() {
        guard shouldContinue, let sec = securityField.text.flatMap({ Int($0) }) else {
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

        let price = self.price.multiplying(by: .hundred).intValue
        socket.emit(requestFor: .payment, price, sec)
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        hideKeyboardWhenTappedAround()

        itemTableVC.delegate = self
        priceField.text = price.currencyString

        colorView.startPoint = .bottomLeft
        colorView.endPoint = .topRight

        colorView.animationDuration = 2.4

        colorView.setColors(colors: [
            UIColor(r: 200, g: 245, b:  77),
            UIColor(r:  64, g: 230, b: 155),
            UIColor(r:   0, g: 139, b: 255)
        ])

        socket.once(resultOf: .payment) { [weak self] data, _ in
            print("Payment result:", data)
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

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        colorView.startAnimation()
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        socket.off(resultOf: .payment)
        shouldContinue = true
    }

    func itemTableUpdatedPrice(with difference: NSDecimalNumber) {
        price = price.adding(difference)
        priceField.text = price.currencyString
        print(price)
    }

}
