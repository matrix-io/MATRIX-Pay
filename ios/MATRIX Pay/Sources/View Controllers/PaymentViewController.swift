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

func price(from field: UITextField) -> UInt? {
    guard let text = field.text, let value = Double(text) else {
        return nil
    }
    return UInt(value * 100)
}

class PaymentViewController: UIViewController, UIPickerViewDelegate, UIPickerViewDataSource, UITextFieldDelegate {

    @IBOutlet weak var dropDown: UIPickerView!
    @IBOutlet weak var textbox: UITextField!
    
    
    //@IBOutlet weak var priceField: UITextField!

    @IBOutlet weak var securityField: UITextField!

    @IBOutlet var colorView: PastelView!

    private var shouldContinue = true

//    var price: Int? {
//        guard let text = priceField.text, let value = Double(text) else {
//            return nil
//        }
//        return Int(value * 100)
//    }
    
    var products = ["Lays", "Tostitos", "Queso", "Coke", "Sprite", "Water", "Vodka", "Tequila", "White Wine", "Red Wine", "Beer", "Chicken Tacos", "Pork Tacos", "Veggie Burrito", "Quesadilla"]
    
    func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return 1
    }
    
    func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        var countrows : Int = products.count
        return countrows
    }
    
    func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
        let titleRow = products[row]
        return titleRow
    }
    
    func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
        self.textbox.text = self.products[row]
    }
    
    func textFieldDidBeginEditing(_ textField: UITextField) {
        self.dropDown.isHidden = false
    }
    

//    @IBAction func performPayment() {
//        guard shouldContinue, let price = self.price, let sec = securityField.text.flatMap({ Int($0) }) else {
//            return
//        }
//        guard (socket.engine?.connected ?? false) else {
//            let alert = UIAlertController(title: "Connection Error",
//                                          message: "Not connected to MATRIX. Cannnot perform purchase.",
//                                          preferredStyle: .alert)
//            alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
//            self.present(alert, animated: true, completion: nil)
//            return
//        }
//
//        shouldContinue = false
//
//        socket.emit(requestFor: .payment, price, sec)
//    }

    override func viewDidLoad() {
        super.viewDidLoad()

        dropDown.delegate = self
        dropDown.dataSource = self
        
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

    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }

}
