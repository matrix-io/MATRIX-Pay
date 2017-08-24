//
//  SettingsViewController.swift
//  MATRIX Pay
//
//  Created by Nikolai Vazquez on 6/20/17.
//  Copyright © 2017 MATRIX Labs. All rights reserved.
//

import UIKit
import Pastel
import SocketIO

class SettingsViewController: UIViewController, UITextFieldDelegate {

    @IBOutlet var colorView: PastelView!

    @IBOutlet weak var emailField: UITextField!

    @IBAction func updateSettings() {
        guard let url = emailField.text.flatMap(URL.init) else {
            return
        }
        UserDefaults.standard.set(url, forKey: addressKey)
        socket.disconnect()
        socket = SocketIOClient(socketURL: url)
        setupSocket()
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        hideKeyboardWhenTappedAround()
        shouldPopOnDisconnect = false

        if let url = addressFromDefaults() {
            emailField.text = url.absoluteString
        }

        colorView.setColors(colors: [
            UIColor(r: 252, g: 225, b: 138),
            UIColor(r: 255, g: 118, b: 118),
            UIColor(r: 240, g:  47, b: 194),
            UIColor(r:  96, g: 148, b: 234),
            UIColor(r:  74, g: 202, b: 238),
            UIColor(r:  82, g: 227, b: 212),
            UIColor(r:  66, g: 230, b: 100),
            UIColor(r: 149, g: 231, b:  76),
            UIColor(r: 242, g: 239, b:  44)
        ])

        colorView.startAnimation()
    }

    override func viewWillDisappear(_ animated: Bool) {
        shouldPopOnDisconnect = true
        super.viewWillDisappear(animated)
    }

    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        updateSettings()
        return true
    }

    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }

}
