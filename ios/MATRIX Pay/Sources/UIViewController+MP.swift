//
//  UIViewController+MP.swift
//  MATRIX Pay
//
//  Created by Nikolai Vazquez on 6/10/17.
//  Copyright © 2017 MATRIX Labs. All rights reserved.
//

import UIKit

extension UIViewController {

    static func instantiate(from storyBoard: UIStoryboard?) -> Self? {
        func helper<T>() -> T? {
            let id = String(describing: T.self)
            let result = storyBoard?.instantiateViewController(withIdentifier: id)
            return result as? T
        }
        return helper()
    }

    func push<T: UIViewController>(viewController: T.Type, animated: Bool) {
        guard let vc = T.instantiate(from: storyboard) else {
            return
        }
        navigationController?.pushViewController(vc, animated: animated)
    }

}
