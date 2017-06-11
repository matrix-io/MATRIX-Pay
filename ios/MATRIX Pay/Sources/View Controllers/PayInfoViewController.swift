//
//  PayInfoViewController.swift
//  MATRIX Pay
//
//  Created by Nikolai Vazquez on 6/10/17.
//  Copyright © 2017 MATRIX Labs. All rights reserved.
//

import UIKit

func handle(text: String) -> UInt? {
    let result = text.isEmpty ? nil : UInt(text)
    if result == nil {
        print(text)
    }
    return result
}

class PayInfoViewController: UIViewController {

    @IBOutlet weak var ccNumberField: UITextField!

    @IBOutlet weak var ccCvcField: UITextField!

    @IBOutlet weak var ccMonthField: UITextField!

    @IBOutlet weak var ccDayField: UITextField!

    @IBOutlet weak var ccNameField: UITextField!

    @IBOutlet weak var securityField: UITextField!

    private var shouldContinue = true

    @IBAction func submitPayInfo() {
        guard shouldContinue,
            let num = ccNumberField.text,
            let cvc = ccCvcField.text.flatMap(handle),
            let mon = ccMonthField.text.flatMap(handle),
            let day = ccMonthField.text.flatMap(handle),
            let nam = ccNameField.text,
            let sec = securityField.text.flatMap(handle) else {
                print("Some value isn't right")
                return
        }

        shouldContinue = false

        let userInfo: [String: Any] = [
            "security": sec,
            "ccnum": num,
            "cccvc": cvc,
            "ccexpmon": mon,
            "ccexpday": day,
            "ccname": nam
        ]

        socket.emit("UserInfo", userInfo)
        shouldContinue = true
        self.parent?.parent?.navigationController?.popToRootViewController(animated: true)

        print("All good", userInfo)

    }

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        shouldContinue = true
    }

}
