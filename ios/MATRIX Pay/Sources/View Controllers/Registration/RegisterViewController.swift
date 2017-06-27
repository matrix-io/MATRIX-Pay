//
//  RegisterViewController.swift
//  MATRIX Pay
//
//  Created by Nikolai Vazquez on 6/10/17.
//  Copyright © 2017 MATRIX Labs. All rights reserved.
//

import UIKit
import Pastel

class RegisterViewController: UIViewController {

    @IBOutlet var colorView: PastelView!

    override func viewDidLoad() {
        super.viewDidLoad()

        colorView.startPoint = .bottomLeft
        colorView.endPoint = .topRight

        colorView.animationDuration = 2.4

        colorView.setColors(colors: [
            UIColor(r: 255, g:  69, b: 185),
            UIColor(r:  75, g:  61, b: 100),
            UIColor(r:  61, g: 228, b: 255)
        ])
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        colorView.startAnimation()
    }

    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }

}
