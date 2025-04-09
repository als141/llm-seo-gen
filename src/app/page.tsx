import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ヘッダー */}
      <header className="py-4 px-6 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">
            SaaSアプリ
          </Link>
          <nav className="hidden md:flex space-x-8 items-center">
            <Link href="/#features" className="text-gray-600 hover:text-blue-600">
              機能
            </Link>
            <Link href="/#pricing" className="text-gray-600 hover:text-blue-600">
              料金
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-blue-600">
              ブログ
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600">
              お問い合わせ
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <UserButton afterSignOutUrl="/" />
            <Link
              href="/auth/sign-in"
              className="hidden md:inline-block px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
            >
              ログイン
            </Link>
            <Link
              href="/auth/sign-up"
              className="hidden md:inline-block px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              登録
            </Link>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="flex-grow flex items-center justify-center bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            ビジネスを次のレベルへ
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
            業務効率化や生産性向上を実現する、最先端のSaaSソリューション
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/auth/sign-up"
              className="px-8 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 text-lg font-medium"
            >
              無料で始める
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-3 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 text-lg font-medium"
            >
              料金プランを見る
            </Link>
          </div>
        </div>
      </section>

      {/* 機能セクション */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">主な機能</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              あらゆるビジネスニーズに対応する多彩な機能をご用意しています
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 機能1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">高度な分析</h3>
              <p className="text-gray-600">
                リアルタイムデータ分析でビジネスの成長を促進します。直感的なダッシュボードで重要なメトリクスを一目で把握できます。
              </p>
            </div>

            {/* 機能2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">チームコラボレーション</h3>
              <p className="text-gray-600">
                チームメンバーとシームレスに協力し、プロジェクトを効率的に管理。リアルタイムでの共同作業を実現します。
              </p>
            </div>

            {/* 機能3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">セキュリティ</h3>
              <p className="text-gray-600">
                最高レベルのセキュリティ対策で大切なデータを保護。エンドツーエンドの暗号化で安心してご利用いただけます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 料金セクション */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">シンプルな料金プラン</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              あなたのビジネスに合わせた柔軟なプランをご用意しています
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 料金プラン1 */}
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">スタータープラン</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">¥1,980</span>
                <span className="text-gray-600">/月</span>
              </div>
              <p className="text-gray-600 mb-6">小規模ビジネスや個人向けの基本プラン</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>基本機能</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>5GBのストレージ</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>最大3ユーザー</span>
                </li>
              </ul>
              <Link
                href="/pricing"
                className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                詳細を見る
              </Link>
            </div>

            {/* 料金プラン2 */}
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-blue-500 transform scale-105">
              <div className="inline-block px-3 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full mb-4">
                人気
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">プロフェッショナル</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">¥4,980</span>
                <span className="text-gray-600">/月</span>
              </div>
              <p className="text-gray-600 mb-6">成長中のビジネスに最適な機能が充実</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>すべての基本機能</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>50GBのストレージ</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>最大10ユーザー</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>高度な分析機能</span>
                </li>
              </ul>
              <Link
                href="/pricing"
                className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                詳細を見る
              </Link>
            </div>

            {/* 料金プラン3 */}
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">エンタープライズ</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">¥9,980</span>
                <span className="text-gray-600">/月</span>
              </div>
              <p className="text-gray-600 mb-6">大規模ビジネス向けの最上位プラン</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>すべてのプロ機能</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>無制限ストレージ</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>無制限ユーザー</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>優先サポート</span>
                </li>
              </ul>
              <Link
                href="/pricing"
                className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                詳細を見る
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">今すぐ始めましょう</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
            14日間の無料トライアルで、すべての機能をお試しいただけます。クレジットカードは不要です。
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/auth/sign-up"
              className="px-8 py-3 text-blue-600 bg-white rounded-md hover:bg-gray-100 text-lg font-medium"
            >
              無料トライアルを始める
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 text-white border border-white rounded-md hover:bg-blue-700 text-lg font-medium"
            >
              お問い合わせ
            </Link>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">SaaSアプリ</h3>
              <p className="mb-4">
                最先端のSaaSソリューションでビジネスの成長をサポートします。
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">リンク</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/#features" className="hover:text-white">
                    機能
                  </Link>
                </li>
                <li>
                  <Link href="/#pricing" className="hover:text-white">
                    料金
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white">
                    ブログ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">会社情報</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="hover:text-white">
                    会社概要
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white">
                    採用情報
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    お問い合わせ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">法的情報</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="hover:text-white">
                    利用規約
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    プライバシーポリシー
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} SaaSアプリ. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
              <a href="#" className="hover:text-white">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="hover:text-white">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
