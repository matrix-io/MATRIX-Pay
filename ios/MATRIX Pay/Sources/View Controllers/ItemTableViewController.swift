//
//  ItemTableViewController.swift
//  MATRIX Pay
//
//  Created by Nikolai Vazquez on 8/3/17.
//  Copyright © 2017 MATRIX Labs. All rights reserved.
//

import UIKit

private typealias Item = (name: String, price: NSDecimalNumber)

private let items: [Item] = [
    ("Lays",            05.98),
    ("Tostitos",        02.98),
    ("Queso",           01.49),
    ("Coke",            01.49),
    ("Sprite",          01.49),
    ("Water",           00.99),
    ("Vodka",           13.99),
    ("Tequila",         19.99),
    ("White Wine",      39.99),
    ("Red Wine",        39.99),
    ("Beer",            07.99),
    ("Chicken Tacos",   08.99),
    ("Pork Tacos",      07.29),
    ("Veggie Burrito",  06.50),
    ("Quesadilla",      04.99),
]

private func item(at path: IndexPath) -> Item? {
    var iter = path.makeIterator()
    guard iter.next() == 0, let idx = iter.next() else {
        return nil
    }
    return items[idx]
}

protocol ItemTableViewControllerDelegate: class {

    func itemTableUpdatedPrice(with difference: NSDecimalNumber)

}

class ItemTableViewController: UITableViewController {

    // MARK: - Table view data source

    weak var delegate: ItemTableViewControllerDelegate?

    override func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return items.count
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "Item", for: indexPath)

        if let (name, price) = item(at: indexPath), let main = cell.textLabel, let cost = cell.detailTextLabel {
            main.text = name
            cost.text = price.currencyString
        }

        return cell
    }

    override func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        return false
    }

    override func tableView(_ tableView: UITableView, canMoveRowAt indexPath: IndexPath) -> Bool {
        return false
    }

    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        if let (_, price) = item(at: indexPath) {
            delegate?.itemTableUpdatedPrice(with: price)
        }
    }

    override func tableView(_ tableView: UITableView, didDeselectRowAt indexPath: IndexPath) {
        if let (_, price) = item(at: indexPath) {
            delegate?.itemTableUpdatedPrice(with: price.multiplying(by: -1))
        }
    }

}
