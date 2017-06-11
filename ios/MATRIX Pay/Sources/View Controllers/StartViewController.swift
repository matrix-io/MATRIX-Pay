//
//  StartViewController.swift
//  MATRIX Pay
//
//  Created by Nikolai Vazquez on 6/10/17.
//  Copyright © 2017 MATRIX Labs. All rights reserved.
//

import UIKit
import Pastel

class StartViewController: UIViewController {

    @IBOutlet weak var colorView: PastelView!

    override func viewDidLoad() {
        super.viewDidLoad()

        colorView.startPoint = .bottomLeft
        colorView.endPoint = .topRight

        colorView.animationDuration = 0.8

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

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        colorView.startAnimation()
    }

}
