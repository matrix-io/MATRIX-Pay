//
//  ItemTableViewController.swift
//  MATRIX Pay
//
//  Created by Nikolai Vazquez on 8/3/17.
//  Copyright © 2017 MATRIX Labs. All rights reserved.
//

import UIKit

private typealias Item = (name: String, price: NSDecimalNumber)

private let items: [(title: String, values: [Item])] = [
    ("Foods", [
        ("Chicken Tacos",   08.99),
        ("Pork Tacos",      07.29),
        ("Veggie Burrito",  06.50),
        ("Quesadilla",      04.99),
    ]),
    ("Snacks", [
        ("Lays",            05.98),
        ("Tostitos",        02.98),
        ("Queso",           01.49),
    ]),
    ("Drinks", [
        ("Coke",            01.49),
        ("Sprite",          01.49),
        ("Water",           00.99),
    ]),
    ("Alcohol", [
        ("Vodka",           13.99),
        ("Tequila",         19.99),
        ("White Wine",      39.99),
        ("Red Wine",        39.99),
        ("Beer",            07.99),
    ])
]

private func item(at path: IndexPath) -> Item? {
    var iter = path.makeIterator()
    guard let i = iter.next(), let j = iter.next() else {
        return nil
    }
    return items[i].values[j]
}

protocol ItemTableViewControllerDelegate: class {

    func itemTableUpdatedPrice(with difference: NSDecimalNumber)

}

class ItemTableViewController: UITableViewController {

    // MARK: - Table view data source

    weak var delegate: ItemTableViewControllerDelegate?

    override func numberOfSections(in tableView: UITableView) -> Int {
        return items.count
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return items[section].values.count
    }

    override func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        return items[section].title
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "Item", for: indexPath)

        if let (name, price) = item(at: indexPath), let main = cell.textLabel, let cost = cell.detailTextLabel {
            main.text = name
            cost.text = price.currencyString
        }

        let selectedBackgroundView = UIView()
        selectedBackgroundView.backgroundColor = UIColor(r: 102, g: 189, b: 255)
        cell.selectedBackgroundView = selectedBackgroundView

        return cell
    }

    override func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        return false
    }

    override func tableView(_ tableView: UITableView, canMoveRowAt indexPath: IndexPath) -> Bool {
        return false
    }

    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        setCellTextColor(at: indexPath, to: .white)
        if let (_, price) = item(at: indexPath) {
            delegate?.itemTableUpdatedPrice(with: price)
        }
    }

    override func tableView(_ tableView: UITableView, didDeselectRowAt indexPath: IndexPath) {
        setCellTextColor(at: indexPath, to: .black)
        if let (_, price) = item(at: indexPath) {
            delegate?.itemTableUpdatedPrice(with: price.multiplying(by: -1))
        }
    }

    func setCellTextColor(at indexPath: IndexPath, to color: UIColor) {
        if let cell = tableView.cellForRow(at: indexPath) {
            for case let label? in [cell.textLabel, cell.detailTextLabel] {
                label.textColor = color
            }
        }
    }

}
