//
//  EmailViewController.swift
//  MATRIX Pay
//
//  Created by Nikolai Vazquez on 6/10/17.
//  Copyright © 2017 MATRIX Labs. All rights reserved.
//

import UIKit
import SocketIO

var emailResult: Int8 = -1

class EmailViewController: UIViewController, UITextFieldDelegate {

    private var shouldContinue = true

    @IBOutlet weak var emailField: UITextField!

    @IBAction func continueToPayInfo() {
        guard shouldContinue, let email = emailField.text, !email.isEmpty else {
            return
        }
        guard (socket.engine?.connected ?? false) else {
            let alert = UIAlertController(title: "Connection Error",
                                          message: "Not connected to MATRIX. Try again.",
                                          preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
            self.present(alert, animated: true, completion: nil)
            return
        }

        shouldContinue = false

        socket.emit(requestFor: .register, email)
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        emailField.delegate = self

        socket.once(resultOf: .register) { [weak self] data, _ in
            print("Register result:", data)
            guard let `self` = self else {
                return
            }
            let num = (data.first as? NSNumber)?.uint8Value ?? 2
            let alert: UIAlertController

            self.shouldContinue = true

            switch num {
            case 0: // Success
                self.push(viewController: PayInfoViewController.self, animated: true)
                return
            case 1: // Email error
                // Popup email error and ask to change
                alert = UIAlertController(title: "Email Error",
                                          message: "Email '" + self.emailField.text! + "' already in use",
                                          preferredStyle: .alert)
            case _: // Server error
                // Popup server error and ask to retry
                alert = UIAlertController(title: "Server Error",
                                          message: "Some error occured on the server. Attempt retry?",
                                          preferredStyle: .alert)
            }

            alert.addAction(UIAlertAction(title: "Continue", style: .default, handler: nil))
            self.present(alert, animated: true, completion: nil)
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        socket.off(resultOf: .register)
        shouldContinue = true
    }

    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        textField.resignFirstResponder()
        continueToPayInfo()
        return false
    }

}
